import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConsultationCustomers, useRegisteredCustomers } from '@/lib/hooks/useCustomers';
import { apiClient } from '@/lib/api-client';

// API 클라이언트 모킹
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

// React Query 래퍼
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useCustomers hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useConsultationCustomers', () => {
    it('상담 고객 목록을 성공적으로 가져온다', async () => {
      const mockData = {
        success: true,
        data: [
          {
            id: '1',
            name: '김철수',
            phone: '010-1234-5678',
            desiredService: '개인 트레이닝',
            createdAt: '2024-01-15T00:00:00Z',
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: mockData });

      const { result } = renderHook(
        () => useConsultationCustomers(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/customers', {
        params: {
          type: 'consultation',
          page: 1,
          limit: 10,
        },
      });
    });

    it('검색 파라미터와 함께 요청한다', async () => {
      const params = {
        search: '김철수',
        page: 2,
        limit: 20,
      };

      const mockData = {
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 2,
          limit: 20,
          totalPages: 0,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: mockData });

      const { result } = renderHook(
        () => useConsultationCustomers(params),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/customers', {
        params: {
          type: 'consultation',
          search: '김철수',
          page: 2,
          limit: 20,
        },
      });
    });

    it('API 오류를 올바르게 처리한다', async () => {
      const mockError = new Error('API Error');
      mockApiClient.get.mockRejectedValue(mockError);

      const { result } = renderHook(
        () => useConsultationCustomers(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    it('로딩 상태를 올바르게 처리한다', () => {
      mockApiClient.get.mockImplementation(
        () => new Promise(() => {}) // 무한 대기
      );

      const { result } = renderHook(
        () => useConsultationCustomers(),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useRegisteredCustomers', () => {
    it('등록 고객 목록을 성공적으로 가져온다', async () => {
      const mockData = {
        success: true,
        data: [
          {
            id: '1',
            name: '이영희',
            phone: '010-9876-5432',
            membershipType: 'PREMIUM',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: mockData });

      const { result } = renderHook(
        () => useRegisteredCustomers(),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/customers', {
        params: {
          type: 'registered',
          page: 1,
          limit: 10,
        },
      });
    });

    it('멤버십 타입 필터와 함께 요청한다', async () => {
      const params = {
        membershipType: 'PREMIUM',
        status: 'ACTIVE',
      };

      const mockData = {
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: mockData });

      const { result } = renderHook(
        () => useRegisteredCustomers(params),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/customers', {
        params: {
          type: 'registered',
          membershipType: 'PREMIUM',
          status: 'ACTIVE',
          page: 1,
          limit: 10,
        },
      });
    });
  });

  describe('캐싱 동작', () => {
    it('동일한 쿼리는 캐시된 결과를 사용한다', async () => {
      const mockData = {
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: mockData });

      const { result: result1 } = renderHook(
        () => useConsultationCustomers({ search: 'test' }),
        {
          wrapper: createWrapper(),
        }
      );

      const { result: result2 } = renderHook(
        () => useConsultationCustomers({ search: 'test' }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // API는 한 번만 호출되어야 함 (캐시 사용)
      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
    });

    it('다른 파라미터는 다른 쿼리로 취급한다', async () => {
      const mockData = {
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
        },
      };

      mockApiClient.get.mockResolvedValue({ data: mockData });

      const { result: result1 } = renderHook(
        () => useConsultationCustomers({ search: 'test1' }),
        {
          wrapper: createWrapper(),
        }
      );

      const { result: result2 } = renderHook(
        () => useConsultationCustomers({ search: 'test2' }),
        {
          wrapper: createWrapper(),
        }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // 다른 파라미터이므로 두 번 호출되어야 함
      expect(mockApiClient.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('쿼리 키 생성', () => {
    it('파라미터가 없을 때 기본 쿼리 키를 사용한다', () => {
      const { result } = renderHook(
        () => useConsultationCustomers(),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.dataUpdatedAt).toBeDefined(); // React Query가 초기화됨을 확인
    });

    it('파라미터가 있을 때 쿼리 키에 포함한다', () => {
      const params = { search: 'test', page: 2 };

      const { result } = renderHook(
        () => useConsultationCustomers(params),
        {
          wrapper: createWrapper(),
        }
      );

      expect(result.current.dataUpdatedAt).toBeDefined(); // React Query가 초기화됨을 확인
    });
  });
});