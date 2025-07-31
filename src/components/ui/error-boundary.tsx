'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 사용자 정의 에러 핸들러 실행
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 프로덕션에서는 에러 리포팅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      // 예: Sentry, LogRocket 등
      // reportError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// 기본 에러 UI
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        <div className="flex justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">
            문제가 발생했습니다
          </h2>
          <p className="text-gray-600">
            예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        </div>

        {isDevelopment && (
          <details className="text-left bg-gray-50 p-3 rounded text-sm">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              에러 상세정보 (개발모드)
            </summary>
            <div className="text-red-600 whitespace-pre-wrap font-mono text-xs">
              {error.name}: {error.message}
              {error.stack && (
                <>
                  {'\n\n'}
                  {error.stack}
                </>
              )}
            </div>
          </details>
        )}

        <div className="flex space-x-2 justify-center">
          <Button onClick={resetError} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            size="sm"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로
          </Button>
        </div>
      </Card>
    </div>
  );
}

// API 에러 전용 컴포넌트
interface ApiErrorProps {
  error: {
    message: string;
    status?: number;
    code?: string;
  };
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ApiError({ error, onRetry, showDetails = false }: ApiErrorProps) {
  const getErrorTitle = () => {
    switch (error.status) {
      case 404:
        return '데이터를 찾을 수 없습니다';
      case 403:
        return '접근 권한이 없습니다';
      case 401:
        return '로그인이 필요합니다';
      case 500:
        return '서버 오류가 발생했습니다';
      default:
        return '오류가 발생했습니다';
    }
  };

  const getErrorMessage = () => {
    switch (error.status) {
      case 404:
        return '요청한 데이터를 찾을 수 없습니다.';
      case 403:
        return '이 작업을 수행할 권한이 없습니다.';
      case 401:
        return '로그인 후 다시 시도해주세요.';
      case 500:
        return '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
      default:
        return error.message || '알 수 없는 오류가 발생했습니다.';
    }
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md w-full p-6 text-center space-y-4">
        <div className="flex justify-center">
          <AlertTriangle className="w-10 h-10 text-orange-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            {getErrorTitle()}
          </h3>
          <p className="text-gray-600 text-sm">
            {getErrorMessage()}
          </p>
        </div>

        {showDetails && error.code && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            에러 코드: {error.code}
          </div>
        )}

        {onRetry && (
          <Button onClick={onRetry} size="sm" className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        )}
      </Card>
    </div>
  );
}

// React Query 에러용 컴포넌트
export function QueryError({ 
  error, 
  refetch 
}: { 
  error: any; 
  refetch?: () => void; 
}) {
  const apiError = {
    message: error?.response?.data?.error || error?.message || '알 수 없는 오류',
    status: error?.response?.status,
    code: error?.response?.data?.code,
  };

  return <ApiError error={apiError} onRetry={refetch} />;
}

// 페이지 레벨 에러 바운더리
export function PageErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 페이지 에러 로깅
        console.error('Page Error:', error, errorInfo);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}