import { NextRequest } from 'next/server';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logLevel = process.env.LOG_LEVEL || 'info';

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentIndex = levels.indexOf(this.logLevel as LogLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex <= currentIndex;
  }

  private formatMessage(entry: LogEntry): string {
    const { timestamp, level, message, context, userId, requestId, ip } = entry;
    
    if (this.isDevelopment) {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}${
        context ? ` | Context: ${JSON.stringify(context, null, 2)}` : ''
      }${userId ? ` | User: ${userId}` : ''}${requestId ? ` | Request: ${requestId}` : ''}`;
    }

    // 프로덕션에서는 구조화된 로그
    return JSON.stringify({
      timestamp,
      level,
      message,
      context,
      userId,
      requestId,
      ip: ip ? this.maskIP(ip) : undefined,
    });
  }

  private maskIP(ip: string): string {
    // IP 마스킹 (192.168.1.xxx)
    return ip.replace(/\.\d+$/, '.xxx');
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    const formattedMessage = this.formatMessage(entry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
    }
  }

  error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  // API 전용 로깅 메서드
  apiRequest(req: NextRequest, context?: Record<string, any>): void {
    const requestId = crypto.randomUUID();
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    this.info(`API Request: ${req.method} ${req.url}`, {
      ...context,
      requestId,
      ip: this.isDevelopment ? ip : this.maskIP(ip),
      userAgent: this.isDevelopment ? userAgent : 'masked',
    });
  }

  apiResponse(method: string, url: string, status: number, duration: number, context?: Record<string, any>): void {
    this.info(`API Response: ${method} ${url} - ${status} (${duration}ms)`, context);
  }

  apiError(req: NextRequest, error: Error, context?: Record<string, any>): void {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    this.error(`API Error: ${req.method} ${req.url}`, {
      ...context,
      error: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
      ip: this.isDevelopment ? ip : this.maskIP(ip),
    });
  }

  // 데이터베이스 로깅
  dbQuery(query: string, duration: number, context?: Record<string, any>): void {
    this.debug(`DB Query executed in ${duration}ms`, {
      ...context,
      query: this.isDevelopment ? query : 'masked',
    });
  }

  dbError(query: string, error: Error, context?: Record<string, any>): void {
    this.error(`DB Query failed`, {
      ...context,
      query: this.isDevelopment ? query : 'masked',
      error: error.message,
      stack: this.isDevelopment ? error.stack : undefined,
    });
  }

  // 사용자 활동 로깅
  userAction(userId: string, action: string, context?: Record<string, any>): void {
    this.info(`User action: ${action}`, {
      ...context,
      userId,
    });
  }

  // 보안 이벤트 로깅
  securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: Record<string, any>): void {
    this.warn(`Security Event [${severity.toUpperCase()}]: ${event}`, context);
  }
}

export const logger = new Logger();