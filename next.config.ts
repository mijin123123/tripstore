import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify 배포를 위한 설정
  trailingSlash: false,
  
  images: {
    // Netlify의 이미지 최적화 기능을 사용하지 않는 경우 true로 설정할 수 있습니다.
    unoptimized: true, 
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
  
  // 빌드 시 타입스크립트 및 ESLint 오류를 무시합니다.
  // 프로덕션 빌드 전에는 이 옵션들을 제거하고 오류를 해결하는 것이 좋습니다.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
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
