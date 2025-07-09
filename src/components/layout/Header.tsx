"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// 간단한 사용자 타입 정의
type User = {
  id: string;
  email: string;
  name: string;
};

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
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

  useEffect(() => {
    // localStorage에서 사용자 정보 확인
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('tripstore-user');
        console.log('헤더에서 localStorage 확인:', storedUser);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('파싱된 사용자 데이터:', userData);
          setUser(userData);
        } else {
          console.log('localStorage에 사용자 정보 없음');
          setUser(null);
        }
      } catch (error) {
        console.error('사용자 정보 확인 중 오류:', error);
        localStorage.removeItem('tripstore-user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시 동기화)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tripstore-user') {
        console.log('Storage 변경 감지:', e.newValue);
        checkUser();
      }
    };

    // custom event 리스너 (같은 탭에서의 변경사항 감지)
    const handleUserChange = () => {
      console.log('사용자 변경 이벤트 감지');
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userChanged', handleUserChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userChanged', handleUserChange);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      // 서버에 로그아웃 요청
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      console.log('로그아웃 처리 중...');
      
      // 클라이언트 상태 초기화
      setUser(null);
      localStorage.removeItem('tripstore-user');
      
      // 헤더 컴포넌트에 변경사항 알리기
      window.dispatchEvent(new Event('userChanged'));
      
      // 홈으로 이동
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 오류가 발생해도 클라이언트 상태는 초기화
      setUser(null);
      localStorage.removeItem('tripstore-user');
      window.dispatchEvent(new Event('userChanged'));
    }
  };

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
          <span className={showHeaderBg ? 'text-[var(--brand-blue)]' : 'text-white'}>
            TripStore
          </span>
        </Link>
        <nav className="space-x-6 flex items-center">
          <Link href="/packages" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-[var(--brand-blue)]' : 'text-white hover:text-neutral-200'}`}>
            여행 상품
          </Link>
          <Link href="/notice" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-[var(--brand-blue)]' : 'text-white hover:text-neutral-200'}`}>
            고객센터
          </Link>
          
          {loading ? (
            <span className={`text-lg font-medium ${showHeaderBg ? 'text-neutral-700' : 'text-white'}`}>
              로딩 중...
            </span>
          ) : user ? (
            // 로그인된 상태
            <>
              <Link href="/mypage" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-[var(--brand-blue)]' : 'text-white hover:text-neutral-200'}`}>
                마이페이지
              </Link>
              <button
                onClick={handleSignOut}
                className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-[var(--brand-blue)]' : 'text-white hover:text-neutral-200'}`}
              >
                로그아웃
              </button>
              <span className={`text-sm ${showHeaderBg ? 'text-neutral-600' : 'text-white/80'}`}>
                {user.name || user.email}님
              </span>
            </>
          ) : (
            // 로그인되지 않은 상태
            <>
              <Link href="/login" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-[var(--brand-blue)]' : 'text-white hover:text-neutral-200'}`}>
                로그인
              </Link>
              <Link href="/register" className={`text-lg font-medium transition-colors duration-300 ${showHeaderBg ? 'text-neutral-700 hover:text-[var(--brand-blue)]' : 'text-white hover:text-neutral-200'}`}>
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
