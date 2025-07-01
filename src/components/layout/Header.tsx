"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const showHeaderBg = !isHome || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // isHome일 때만 스크롤 이벤트 리스너 추가
    if (isHome) {
      window.addEventListener('scroll', handleScroll);
    } else {
      // 다른 페이지에서는 항상 스크롤된 것처럼 처리
      setIsScrolled(true);
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      if (isHome) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showHeaderBg
          ? 'bg-white/90 shadow-md backdrop-blur-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-3xl font-extrabold">
          <span className={showHeaderBg ? 'text-brand-blue' : 'text-white'}>
            TripStore
          </span>
        </Link>
        <nav className="space-x-6 flex items-center">
          <Link href="/packages" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-brand-blue' : 'text-white hover:text-neutral-200'}`}>
            여행 상품
          </Link>
          <Link href="/notice" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-brand-blue' : 'text-white hover:text-neutral-200'}`}>
            고객센터
          </Link>
          <Link href="/login" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-brand-blue' : 'text-white hover:text-neutral-200'}`}>
            로그인
          </Link>
          <Link href="/register" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-brand-blue' : 'text-white hover:text-neutral-200'}`}>
            회원가입
          </Link>
        </nav>
      </div>
    </header>
  );
}
