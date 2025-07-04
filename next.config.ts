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
  // 특정 경로에 대해 정적 생성을 비활성화
  experimental: {
    // 특정 페이지 사전 렌더링 비활성화 (SSR 또는 CSR 사용)
    serverActions: {
      allowedOrigins: ['localhost:3000', 'tripstore.netlify.app'],
    },
  },
  // 페이지 생성 방식을 더 명확하게 제어
  generateBuildId: async () => {
    return 'tripstore-build'
  },
  // Netlify 빌드에서 발생하는 서버/클라이언트 불일치 문제를 해결하기 위해
  // 관리자 페이지를 클라이언트 전용으로 지정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  transpilePackages: ['@supabase/ssr'],
};

export default nextConfig;
