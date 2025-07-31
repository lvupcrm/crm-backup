import React from 'react';
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

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
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
  });
});