import { NextRequest } from 'next/server';
import { logger } from './logger';

// 보안 헤더 설정
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const;

// CORS 설정
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
} as const;

// 속도 제한 (Rate Limiting)
class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private readonly windowMs = 15 * 60 * 1000; // 15분
  private readonly maxRequests = 100; // 15분당 최대 요청 수

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // 새로운 윈도우 시작
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (record.count >= this.maxRequests) {
      logger.securityEvent(
        `Rate limit exceeded for ${identifier}`,
        'medium',
        { identifier, count: record.count, limit: this.maxRequests }
      );
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record || Date.now() > record.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - record.count);
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// IP 기반 식별자 생성
export function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : req.ip || 'unknown';
  return ip;
}

// 입력 검증 및 새니타이제이션
export class InputValidator {
  // SQL Injection 패턴 검사
  static checkSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/i,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/i,
      /(--|\/\*|\*\/|;|'|"|`)/,
      /(\bscript\b|\bon\w+\s*=)/i,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  // XSS 패턴 검사
  static checkXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe\b[^>]*>/i,
      /<object\b[^>]*>/i,
      /<embed\b[^>]*>/i,
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  // 경로 순회 공격 검사
  static checkPathTraversal(input: string): boolean {
    const pathPatterns = [
      /\.\.\//,
      /\.\.\\\\/,
      /%2e%2e%2f/i,
      /%2e%2e%5c/i,
      /\.\.%2f/i,
      /\.\.%5c/i,
    ];
    
    return pathPatterns.some(pattern => pattern.test(input));
  }

  // 종합 검증
  static validateInput(input: string, context: string): { isValid: boolean; threats: string[] } {
    const threats: string[] = [];
    
    if (this.checkSQLInjection(input)) {
      threats.push('SQL_INJECTION');
    }
    
    if (this.checkXSS(input)) {
      threats.push('XSS');
    }
    
    if (this.checkPathTraversal(input)) {
      threats.push('PATH_TRAVERSAL');
    }
    
    if (threats.length > 0) {
      logger.securityEvent(
        `Malicious input detected in ${context}`,
        'high',
        { input: input.substring(0, 100), threats, context }
      );
    }
    
    return {
      isValid: threats.length === 0,
      threats,
    };
  }
}

// API 보안 미들웨어
export function withSecurity(
  handler: (req: NextRequest) => Promise<Response>
) {
  return async (req: NextRequest): Promise<Response> => {
    const clientId = getClientIdentifier(req);
    
    // Rate Limiting 체크
    if (!rateLimiter.isAllowed(clientId)) {
      logger.securityEvent(
        'Rate limit exceeded',
        'medium',
        { clientId, method: req.method, url: req.url }
      );
      
      return new Response(
        JSON.stringify({
          success: false,
          error: '요청 횟수 제한을 초과했습니다. 잠시 후 다시 시도해주세요.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900', // 15분
            ...securityHeaders,
          },
        }
      );
    }

    // Content-Type 검증 (POST/PUT 요청)
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        logger.securityEvent(
          'Invalid Content-Type',
          'low',
          { contentType, method: req.method, url: req.url, clientId }
        );
        
        return new Response(
          JSON.stringify({
            success: false,
            error: '올바르지 않은 Content-Type입니다.',
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...securityHeaders,
            },
          }
        );
      }
    }

    // Body 크기 제한 (10MB)
    const maxBodySize = 10 * 1024 * 1024;
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > maxBodySize) {
      logger.securityEvent(
        'Request body too large',
        'medium',
        { contentLength, maxSize: maxBodySize, clientId }
      );
      
      return new Response(
        JSON.stringify({
          success: false,
          error: '요청 데이터가 너무 큽니다.',
        }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders,
          },
        }
      );
    }

    try {
      // 실제 핸들러 실행
      const response = await handler(req);
      
      // 보안 헤더 추가
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      logger.securityEvent(
        'Unhandled error in security middleware',
        'high',
        { error: (error as Error).message, clientId, url: req.url }
      );
      
      return new Response(
        JSON.stringify({
          success: false,
          error: '서버 오류가 발생했습니다.',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...securityHeaders,
          },
        }
      );
    }
  };
}

// 정기적으로 Rate Limiter 정리
setInterval(() => {
  rateLimiter.cleanup();
}, 60 * 1000); // 1분마다 정리