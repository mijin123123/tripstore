import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify 배포를 위해 standalone 대신 export 사용
  // output: 'standalone',

  // Netlify 배포를 위해 trailingSlash는 false로 유지합니다.
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

  // serverActions는 필요 시 유지합니다.
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'mellifluous-druid-c3d6b0.netlify.app'],
    },
  },
};

export default nextConfig;
