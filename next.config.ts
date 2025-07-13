import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 서버 렌더링 활성화 (기본값)
  // 정적 내보내기를 사용하지 않음으로써 동적 라우팅과 API 라우트를 활성화
  trailingSlash: true,
  
  images: {
    // 넷리파이에서는 Next.js의 이미지 최적화를 사용할 수 없으므로 비활성화
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
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 정적 생성 문제 해결을 위한 설정
  output: 'standalone', // 독립 실행형 출력 사용
  
  // 서버 컴포넌트 및 실험적 기능 설정
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'tripstore.netlify.app'],
    },
  },
  
  // Netlify에서 정적 생성 관련 문제 해결을 위한 설정
  distDir: '.next',
  
  // 페이지 생성 방식을 더 명확하게 제어
  generateBuildId: async () => {
    return 'tripstore-build'
  },
  
  // 파일 확장자 지정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // MongoDB 관련 트랜스파일 패키지 (필요시)
  transpilePackages: ['mongoose'],
  
  // 환경 변수 설정
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // 정적 최적화 비활성화
  poweredByHeader: false,
};

export default nextConfig;
