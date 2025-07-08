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
  
  // 모든 페이지를 서버 사이드 렌더링으로 처리
  compiler: {
    styledComponents: true,
  },
  
  // 빌드 오류를 무시
  reactStrictMode: false,
  
  // Netlify에서 정적 생성 관련 문제 해결을 위한 설정
  distDir: '.next',
  
  // 클라이언트 측에서 'pg' 같은 서버 전용 모듈을 사용할 때 에러 방지
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 클라이언트 번들에서 Node.js 모듈을 빈 객체로 대체
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
        'pg-connection-string': false,
        'pg-native': false,
      };
    }
    return config;
  },
  
  // 관리자 페이지를 동적으로 렌더링하도록 설정
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'tripstore.netlify.app'],
    }
  },
  
  // 페이지 생성 방식을 더 명확하게 제어
  generateBuildId: async () => {
    return 'tripstore-build'
  },
  
  // 파일 확장자 지정
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // 트랜스파일 패키지
  transpilePackages: ['@supabase/ssr'],
  
  // 정적 최적화 비활성화
  poweredByHeader: false,
}

export default nextConfig;
