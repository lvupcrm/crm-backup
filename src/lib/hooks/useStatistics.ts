import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export const useDashboardStats = (params?: {
  startDate?: string;
  endDate?: string;
  branchId?: string;
}) => {
  return useQuery({
    queryKey: ['statistics', 'dashboard', params],
    queryFn: () => apiClient.get('/statistics', {
      params: {
        type: 'dashboard',
        ...params,
      },
    }),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

export const useCustomerStats = (params?: {
  startDate?: string;
  endDate?: string;
  branchId?: string;
}) => {
  return useQuery({
    queryKey: ['statistics', 'customers', params],
    queryFn: () => apiClient.get('/statistics', {
      params: {
        type: 'customers',
        ...params,
      },
    }),
    staleTime: 10 * 60 * 1000,
  });
};

export const useRevenueStats = (params?: {
  startDate?: string;
  endDate?: string;
  branchId?: string;
}) => {
  return useQuery({
    queryKey: ['statistics', 'revenue', params],
    queryFn: () => apiClient.get('/statistics', {
      params: {
        type: 'revenue',
        ...params,
      },
    }),
    staleTime: 10 * 60 * 1000,
  });
};

export const useMessageStats = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['statistics', 'messages', params],
    queryFn: () => apiClient.get('/statistics', {
      params: {
        type: 'messages',
        ...params,
      },
    }),
    staleTime: 10 * 60 * 1000,
  });
};