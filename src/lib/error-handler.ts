import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

// 에러 타입 정의
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: any;
}

// 커스텀 에러 클래스
export class AppError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: any;

  constructor(message: string, status: number = 500, code: string = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'AppError';

    // Error 클래스의 프로토타입 체인 복원
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 비즈니스 로직 에러
export class BusinessError extends AppError {
  constructor(message: string, code: string = 'BUSINESS_ERROR', details?: any) {
    super(message, 400, code, details);
    this.name = 'BusinessError';
  }
}

// 권한 에러
export class AuthorizationError extends AppError {
  constructor(message: string = '권한이 없습니다', code: string = 'UNAUTHORIZED') {
    super(message, 403, code);
    this.name = 'AuthorizationError';
  }
}

// 인증 에러
export class AuthenticationError extends AppError {
  constructor(message: string = '인증이 필요합니다', code: string = 'AUTHENTICATION_REQUIRED') {
    super(message, 401, code);
    this.name = 'AuthenticationError';
  }
}

// 리소스 찾기 실패 에러
export class NotFoundError extends AppError {
  constructor(message: string = '리소스를 찾을 수 없습니다', code: string = 'NOT_FOUND') {
    super(message, 404, code);
    this.name = 'NotFoundError';
  }
}

// 유효성 검증 에러
export class ValidationError extends AppError {
  constructor(message: string, details?: any, code: string = 'VALIDATION_ERROR') {
    super(message, 400, code, details);
    this.name = 'ValidationError';
  }
}

// 충돌 에러 (중복 데이터 등)
export class ConflictError extends AppError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, 409, code);
    this.name = 'ConflictError';
  }
}

// 에러 로깅 함수
export function logError(error: Error, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context,
  };

  // 개발 환경에서는 콘솔에 출력
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error occurred:', errorInfo);
  }

  // 프로덕션 환경에서는 외부 로깅 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // 예: Sentry, LogRocket, DataDog 등
    // logger.error(errorInfo);
  }
}

// Zod 에러 처리
export function handleZodError(error: ZodError): ValidationError {
  const formattedErrors = error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));

  return new ValidationError(
    '유효성 검증에 실패했습니다',
    formattedErrors,
    'VALIDATION_ERROR'
  );
}

// Prisma 에러 처리
export function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): AppError {
  switch (error.code) {
    case 'P2002':
      // 유니크 제약 조건 위반
      return new ConflictError(
        '이미 존재하는 데이터입니다',
        'DUPLICATE_ENTRY'
      );
    
    case 'P2025':
      // 레코드를 찾을 수 없음
      return new NotFoundError(
        '요청한 데이터를 찾을 수 없습니다',
        'RECORD_NOT_FOUND'
      );
    
    case 'P2003':
      // 외래키 제약 조건 위반
      return new BusinessError(
        '참조된 데이터가 존재하지 않습니다',
        'FOREIGN_KEY_CONSTRAINT'
      );
    
    case 'P2014':
      // 관련 레코드가 존재하여 삭제할 수 없음
      return new BusinessError(
        '관련 데이터가 존재하여 삭제할 수 없습니다',
        'RELATED_RECORDS_EXIST'
      );
    
    default:
      return new AppError(
        '데이터베이스 오류가 발생했습니다',
        500,
        'DATABASE_ERROR'
      );
  }
}

// 통합 에러 핸들러
export function handleApiError(error: unknown, context?: Record<string, any>): NextResponse {
  // 에러 로깅
  if (error instanceof Error) {
    logError(error, context);
  }

  // AppError 타입 처리
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      },
      { status: error.status }
    );
  }

  // Zod 에러 처리
  if (error instanceof ZodError) {
    const validationError = handleZodError(error);
    return NextResponse.json(
      {
        success: false,
        error: validationError.message,
        code: validationError.code,
        details: validationError.details,
      },
      { status: validationError.status }
    );
  }

  // Prisma 에러 처리
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaError = handlePrismaError(error);
    return NextResponse.json(
      {
        success: false,
        error: prismaError.message,
        code: prismaError.code,
      },
      { status: prismaError.status }
    );
  }

  // 기타 Prisma 에러
  if (error instanceof Prisma.PrismaClientError) {
    return NextResponse.json(
      {
        success: false,
        error: '데이터베이스 연결 오류가 발생했습니다',
        code: 'DATABASE_CONNECTION_ERROR',
      },
      { status: 500 }
    );
  }

  // 알 수 없는 에러
  const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
  
  return NextResponse.json(
    {
      success: false,
      error: '서버 오류가 발생했습니다',
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { debug: errorMessage }),
    },
    { status: 500 }
  );
}

// API 라우트 래퍼 (에러 핸들링 자동화)
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleApiError(error, {
        handler: handler.name,
        args: args.length,
        timestamp: new Date().toISOString(),
      });
    }
  };
}

// 클라이언트 사이드 에러 처리
export function handleClientError(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  // API 응답 에러
  if (typeof error === 'object' && error !== null) {
    const apiError = error as any;
    if (apiError.response?.data?.error) {
      return apiError.response.data.error;
    }
    if (apiError.message) {
      return apiError.message;
    }
  }

  return '알 수 없는 오류가 발생했습니다';
}

// 에러 재시도 유틸리티
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // 재시도 전 대기
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
}

// 에러 상태 확인 유틸리티
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AppError) {
    // 5xx 에러는 재시도 가능
    return error.status >= 500;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('network') ||
      message.includes('timeout') ||
      message.includes('connection')
    );
  }

  return false;
}