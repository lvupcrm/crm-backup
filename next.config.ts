import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 성능 최적화
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  images: {
    // 이미지 최적화 설정
    formats: ["image/webp", "image/avif"],
  },
  // 보안 헤더 추가
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options", 
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
