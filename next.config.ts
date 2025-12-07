import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 15.4 Turbopack 안정화 설정
  turbopack: {
    // SVG 파일 처리 규칙
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // 성능 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 캐싱 정책 (Next.js 15 기본값)
  cacheHandler: undefined, // 기본 캐시 핸들러 사용

  // 빌드 중 ESLint 검사 무시 (에러가 있어도 빌드 계속)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://harxiv.com/api/:path*'  // 실제 도메인으로 변경
  //     }
  //   ]
  // }
};

export default nextConfig;
