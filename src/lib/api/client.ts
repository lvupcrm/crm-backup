import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/lib/types';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // NextAuth 세션 토큰이 있으면 추가
    const token = localStorage.getItem('nextauth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // API 응답 구조에 맞게 데이터 반환
    return response.data;
  },
  (error: AxiosError<ApiResponse>) => {
    // 에러 처리
    if (error.response?.status === 401) {
      // 인증 에러 - 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      // 권한 에러
      console.error('권한이 없습니다:', error.response.data?.error);
    } else if (error.response?.status >= 500) {
      // 서버 에러
      console.error('서버 오류:', error.response.data?.error);
    }
    
    return Promise.reject(error);
  }
);

export { apiClient };