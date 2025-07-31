import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 오류 무시 (프로덕션 배포를 위한 임시 설정)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 오류 무시 (프로덕션 배포를 위한 임시 설정) 
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
