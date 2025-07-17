import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify 배포를 위한 설정
  trailingSlash: false,
  
  images: {
    // 프로덕션 환경에서만 이미지 최적화 비활성화
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
    ],
  },
  
  // 프로덕션 빌드 시에만 타입스크립트 및 ESLint 오류를 무시합니다.
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Netlify에서 Edge Functions 사용
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'mellifluous-druid-c3d6b0.netlify.app'],
    },
  },
  
  // 리다이렉션과 리라이팅 설정
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
