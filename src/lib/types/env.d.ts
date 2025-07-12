// 환경변수 타입 정의

namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    // 클라이언트에서 사용하는 환경변수는 NEXT_PUBLIC_ 접두사 필수
    NEXT_PUBLIC_API_BASE_URL?: string;
    NEXT_PUBLIC_SOME_KEY?: string;
    // 필요시 추가
  }
} 