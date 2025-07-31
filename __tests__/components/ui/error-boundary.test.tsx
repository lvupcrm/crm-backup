import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary, ApiError, QueryError, PageErrorBoundary } from '@/components/ui/error-boundary';

// 에러를 발생시키는 테스트 컴포넌트
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

// console.error 모킹
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe('Error Components', () => {
  describe('ErrorBoundary', () => {
    it('에러가 없을 때 자식 컴포넌트를 정상 렌더링한다', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No Error')).toBeInTheDocument();
    });

    it('에러 발생 시 기본 에러 UI를 표시한다', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /다시 시도/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /홈으로/i })).toBeInTheDocument();
    });

    it('커스텀 에러 핸들러가 호출된다', () => {
      const onError = jest.fn();
      
      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('다시 시도 버튼이 작동한다', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const retryButton = screen.getByRole('button', { name: /다시 시도/i });
      fireEvent.click(retryButton);

      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No Error')).toBeInTheDocument();
    });

    it('커스텀 fallback 컴포넌트를 사용한다', () => {
      const CustomFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => (
        <div>
          <p>Custom Error: {error.message}</p>
          <button onClick={resetError}>Reset</button>
        </div>
      );

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom Error: Test error')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    });
  });

  describe('ApiError', () => {
    it('기본 API 에러를 렌더링한다', () => {
      const error = {
        message: 'API Error',
        status: 500,
      };

      render(<ApiError error={error} />);

      expect(screen.getByText('서버 오류가 발생했습니다')).toBeInTheDocument();
      expect(screen.getByText('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')).toBeInTheDocument();
    });

    it('404 에러를 올바르게 표시한다', () => {
      const error = {
        message: 'Not Found',
        status: 404,
      };

      render(<ApiError error={error} />);

      expect(screen.getByText('데이터를 찾을 수 없습니다')).toBeInTheDocument();
      expect(screen.getByText('요청한 데이터를 찾을 수 없습니다.')).toBeInTheDocument();
    });

    it('403 에러를 올바르게 표시한다', () => {
      const error = {
        message: 'Forbidden',
        status: 403,
      };

      render(<ApiError error={error} />);

      expect(screen.getByText('접근 권한이 없습니다')).toBeInTheDocument();
      expect(screen.getByText('이 작업을 수행할 권한이 없습니다.')).toBeInTheDocument();
    });

    it('401 에러를 올바르게 표시한다', () => {
      const error = {
        message: 'Unauthorized',
        status: 401,
      };

      render(<ApiError error={error} />);

      expect(screen.getByText('로그인이 필요합니다')).toBeInTheDocument();
      expect(screen.getByText('로그인 후 다시 시도해주세요.')).toBeInTheDocument();
    });

    it('재시도 버튼이 작동한다', () => {
      const onRetry = jest.fn();
      const error = {
        message: 'Error',
        status: 500,
      };

      render(<ApiError error={error} onRetry={onRetry} />);

      const retryButton = screen.getByRole('button', { name: /다시 시도/i });
      fireEvent.click(retryButton);

      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('에러 코드가 표시된다', () => {
      const error = {
        message: 'Error',
        status: 500,
        code: 'INTERNAL_ERROR',
      };

      render(<ApiError error={error} showDetails={true} />);

      expect(screen.getByText('에러 코드: INTERNAL_ERROR')).toBeInTheDocument();
    });
  });

  describe('QueryError', () => {
    it('React Query 에러를 올바르게 처리한다', () => {
      const error = {
        response: {
          status: 404,
          data: {
            error: 'Not found',
            code: 'NOT_FOUND',
          },
        },
      };

      const refetch = jest.fn();

      render(<QueryError error={error} refetch={refetch} />);

      expect(screen.getByText('데이터를 찾을 수 없습니다')).toBeInDocument();
      
      const retryButton = screen.getByRole('button', { name: /다시 시도/i });
      fireEvent.click(retryButton);
      
      expect(refetch).toHaveBeenCalledTimes(1);
    });

    it('일반 에러 메시지를 처리한다', () => {
      const error = {
        message: 'Network Error',
      };

      render(<QueryError error={error} />);

      expect(screen.getByText('오류가 발생했습니다')).toBeInTheDocument();
    });
  });

  describe('PageErrorBoundary', () => {
    it('페이지 레벨 에러 바운더리가 작동한다', () => {
      render(
        <PageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PageErrorBoundary>
      );

      expect(screen.getByText('문제가 발생했습니다')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith(
        'Page Error:',
        expect.any(Error),
        expect.any(Object)
      );
    });
  });
});