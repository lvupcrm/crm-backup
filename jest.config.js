const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js 앱의 경로
  dir: './',
})

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  // 테스트 환경 설정
  testEnvironment: 'jsdom',
  
  
  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js|jsx)',
    '**/*.(test|spec).(ts|tsx|js|jsx)',
  ],
  
  // 테스트에서 제외할 파일/폴더
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/dist/',
  ],
  
  // 모듈 변환 제외 패턴
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  
  // 커버리지 설정
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/*.config.{ts,tsx}',
    '!src/app/layout.tsx',
    '!src/app/globals.css',
  ],
  
  // 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // 커버리지 리포터
  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],
  
  // 테스트 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 정적 파일 모킹
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // 테스트 환경 변수
  testEnvironmentOptions: {
    url: 'http://localhost:3000',
  },
  
  // 글로벌 설정
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  
  // 테스트 실행 전 정리
  clearMocks: true,
  restoreMocks: true,
  
  // 최대 워커 수 (성능 최적화)
  maxWorkers: '50%',
  
  // 테스트 타임아웃 (밀리초)
  testTimeout: 10000,
  
  // 에러 출력 상세 설정
  verbose: true,
  
  // 워치 모드 설정
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
}

// createJestConfig는 비동기 함수이므로 내보내기
module.exports = createJestConfig(customJestConfig)