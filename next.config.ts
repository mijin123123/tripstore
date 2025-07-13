import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify에 최적화된 설정
  trailingSlash: false,
  
  images: {
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
  
  // Netlify Functions를 위한 설정
  distDir: '.next',
  
  // 서버 컴포넌트 및 실험적 기능 설정
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'mellifluous-druid-c340bb.netlify.app'],
    },
  },
  
  // 빌드 ID 생성
  generateBuildId: async () => {
    return 'tripstore-build-' + Date.now()
  },
  
  // 파일 확장자 지정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // MongoDB 관련 트랜스파일 패키지
  transpilePackages: ['mongoose'],
  
  // 정적 최적화 비활성화
  poweredByHeader: false,
  
  // 리다이렉트 설정
  async redirects() {
    return []
  },
  
  // 헤더 설정
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
};

export default nextConfig;
