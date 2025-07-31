import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { ApiResponse } from '@/lib/types';

// 에러 타입 정의
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// API 에러 처리
export function handleApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiResponse;
    
    return {
      message: response?.error || error.message || '알 수 없는 오류가 발생했습니다',
      code: response?.code,
      status: error.response?.status,
      details: response?.details,
    };
  }
  
  if (error instanceof ZodError) {
    return {
      message: '입력 데이터가 올바르지 않습니다',
      code: 'VALIDATION_ERROR',
      status: 400,
      details: error.errors,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }
  
  return {
    message: '예상치 못한 오류가 발생했습니다',
    code: 'UNKNOWN_ERROR',
  };
}

// 에러 메시지 포맷팅
export function formatErrorMessage(error: AppError): string {
  if (error.details && Array.isArray(error.details)) {
    // Zod 에러인 경우
    const firstError = error.details[0];
    if (firstError?.message) {
      return firstError.message;
    }
  }
  
  return error.message;
}

// 에러 로깅
export function logError(error: unknown, context?: string) {
  const appError = handleApiError(error);
  
  console.error(`[${context || 'Error'}]`, {
    message: appError.message,
    code: appError.code,
    status: appError.status,
    details: appError.details,
    stack: error instanceof Error ? error.stack : undefined,
  });
}

// 사용자 친화적 에러 메시지 매핑
const ERROR_MESSAGES: Record<string, string> = {
  // 네트워크 에러
  'NETWORK_ERROR': '네트워크 연결을 확인해주세요',
  'TIMEOUT_ERROR': '요청 시간이 초과되었습니다',
  
  // 인증 에러
  'UNAUTHORIZED': '로그인이 필요합니다',
  'FORBIDDEN': '권한이 없습니다',
  'TOKEN_EXPIRED': '세션이 만료되었습니다. 다시 로그인해주세요',
  
  // 데이터 에러
  'NOT_FOUND': '요청한 데이터를 찾을 수 없습니다',
  'DUPLICATE_ENTRY': '이미 존재하는 데이터입니다',
  'VALIDATION_ERROR': '입력 정보를 확인해주세요',
  
  // 서버 에러
  'INTERNAL_SERVER_ERROR': '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요',
  'SERVICE_UNAVAILABLE': '서비스를 일시적으로 사용할 수 없습니다',
  
  // 비즈니스 로직 에러
  'PAYMENT_HISTORY_EXISTS': '결제 내역이 있는 데이터는 삭제할 수 없습니다',
  'MEMBERSHIP_EXPIRED': '멤버십이 만료되었습니다',
  'TEMPLATE_NOT_APPROVED': '승인되지 않은 템플릿입니다',
};

export function getUserFriendlyMessage(error: AppError): string {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  
  // HTTP 상태 코드별 기본 메시지
  switch (error.status) {
    case 400:
      return '잘못된 요청입니다';
    case 401:
      return '로그인이 필요합니다';
    case 403:
      return '권한이 없습니다';
    case 404:
      return '요청한 데이터를 찾을 수 없습니다';
    case 409:
      return '데이터 충돌이 발생했습니다';
    case 422:
      return '입력 정보를 확인해주세요';
    case 429:
      return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요';
    case 500:
      return '서버에 오류가 발생했습니다';
    case 502:
    case 503:
    case 504:
      return '서비스를 일시적으로 사용할 수 없습니다';
    default:
      return formatErrorMessage(error);
  }
}

// React Query 에러 처리 헬퍼
export function createErrorHandler(context: string) {
  return (error: unknown) => {
    const appError = handleApiError(error);
    logError(error, context);
    
    // 토스트나 알림으로 사용자에게 표시할 메시지
    const userMessage = getUserFriendlyMessage(appError);
    
    // 여기서 토스트 라이브러리나 상태 관리를 통해 에러 표시
    // 예: toast.error(userMessage);
    
    return appError;
  };
}

// 재시도 가능한 에러인지 확인
export function isRetryableError(error: AppError): boolean {
  if (!error.status) return false;
  
  // 네트워크 에러나 서버 에러는 재시도 가능
  return error.status >= 500 || error.status === 408 || error.status === 429;
}

// 에러 복원 유틸리티
export function createRetryConfig(error: AppError) {
  if (!isRetryableError(error)) {
    return { retry: false };
  }
  
  return {
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  };
}