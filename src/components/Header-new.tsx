'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Plane, User, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  
  // AuthProvider에서 인증 정보 가져오기
  const { user, session, loading: isLoading, signOut, isAdmin } = useAuth()

  // 인증 정보 로그 확인
  useEffect(() => {
    console.log('Header - 인증 정보:', { 
      isLoggedIn: !!session, 
      user: user,
      isAdmin: isAdmin
    });
    
    // 추가 사용자 정보 가져오기
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const supabase = createClient();
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          
          setUserData(data);
        } catch (error) {
          console.error('사용자 데이터 조회 오류:', error);
        }
      }
    };
    
    fetchUserData();
  }, [session, user, isAdmin]);

  // 관리자 페이지에서는 헤더를 표시하지 않음
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const handleDropdownToggle = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  }

  const categories = {
    overseas: {
      title: '해외여행',
      href: '/overseas/europe',
      items: [
        { name: '유럽', href: '/overseas/europe' },
        { name: '동남아시아', href: '/overseas/southeast-asia' },
        { name: '미주/하와이', href: '/overseas/americas' },
        { name: '일본/중국', href: '/overseas/japan-china' },
        { name: '호주/뉴질랜드', href: '/overseas/oceania' }
      ]
    },
    hotel: {
      title: '호텔',
      href: '/hotel',
      items: [
        { name: '국내 특가호텔', href: '/hotel/domestic' },
        { name: '해외 특가호텔', href: '/hotel/overseas' },
        { name: '리조트/풀빌라', href: '/hotel/resorts' }
      ]
    },
    flights: {
      title: '국내',
      href: '/flights',
      items: [
        { name: '제주도', href: '/flights/jeju' },
        { name: '부산', href: '/flights/busan' },
        { name: '강원도', href: '/flights/gangwon' }
      ]
    },
    activity: {
      title: '액티비티',
      href: '/activity',
      items: [
        { name: '테마파크', href: '/activity/theme-parks' },
        { name: '체험활동', href: '/activity/experiences' },
        { name: '투어/관광', href: '/activity/tours' }
      ]
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-primary-600 font-bold text-2xl">
              <Plane className="w-8 h-8 mr-1" />
              <span className="text-primary-600">TripStore</span>
            </Link>
          </div>

          {/* 데스크톱 메뉴 (중간 크기 이상의 화면에서 보임) */}
          <nav className="hidden md:flex space-x-1 lg:space-x-4">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="relative group">
                <button
                  onClick={() => handleDropdownToggle(key)}
                  className={`flex items-center px-2 py-2 text-gray-700 hover:text-primary-600 focus:outline-none ${
                    activeDropdown === key ? 'text-primary-600' : ''
                  }`}
                >
                  {category.title}
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${
                    activeDropdown === key ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeDropdown === key && (
                  <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                    <div className="py-2">
                      {category.items.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 로그인/회원가입 또는 사용자 메뉴 */}
          <div className="hidden md:flex items-center">
            {!isLoading && !user ? (
              <>
                <Link href="/auth/login" className="text-gray-600 hover:text-primary-600 px-3 py-2">
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  회원가입
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 focus:outline-none"
                >
                  <User className="w-5 h-5 mr-1" />
                  <span>{userData?.name || user?.email || '사용자'}</span>
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${
                    showUserMenu ? 'rotate-180' : ''
                  }`} />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 min-w-[160px]">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b text-sm text-gray-500">
                        {user?.email}
                      </div>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setShowUserMenu(false)}
                        >
                          관리자 페이지
                        </Link>
                      )}
                      <Link
                        href="/mypage"
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                        onClick={() => setShowUserMenu(false)}
                      >
                        마이페이지
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 shadow-lg">
          {/* 모바일 카테고리 메뉴 */}
          <div className="space-y-1">
            {Object.entries(categories).map(([key, category]) => (
              <div key={key}>
                <button
                  onClick={() => handleDropdownToggle(key)}
                  className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-primary-600 focus:outline-none"
                >
                  <span>{category.title}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${
                    activeDropdown === key ? 'rotate-180' : ''
                  }`} />
                </button>
                {activeDropdown === key && (
                  <div className="pl-4 space-y-1">
                    {category.items.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="block py-2 text-gray-600 hover:text-primary-600"
                        onClick={() => {
                          setActiveDropdown(null);
                          setIsMenuOpen(false);
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 모바일 로그인 메뉴 */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            {!isLoading && !user ? (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/auth/login"
                  className="w-full py-2 text-center text-gray-600 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="w-full py-2 text-center bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="py-2 text-sm text-gray-500">
                  {user?.email}
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block py-2 text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    관리자 페이지
                  </Link>
                )}
                <Link
                  href="/mypage"
                  className="block py-2 text-gray-700 hover:text-primary-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full py-2 text-gray-700 hover:text-primary-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
