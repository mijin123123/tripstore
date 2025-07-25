'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Plane, User, LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // AuthProvider에서 인증 정보 가져오기
  const { user, session, loading: isLoading, signOut, isAdmin } = useAuth()

  // 인증 정보 로그 확인
  useEffect(() => {
    console.log('Header - 인증 정보:', { 
      isLoggedIn: !!session, 
      user: user,
      isAdmin: isAdmin
    });
  }, [session, user, isAdmin]);

  // 관리자 페이지에서는 헤더를 표시하지 않음
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const handleLogout = async () => {
    try {
      const result = await signOut()
      if (result.success) {
        console.log('로그아웃 성공');
        router.push('/')
      } else {
        console.error('로그아웃 실패:', result.error)
      }
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleDropdownToggle = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category)
  }

  const categories = {
    overseas: {
      title: '해외여행',
      href: '/overseas/europe',
      items: [
        { name: '유럽', href: '/overseas/europe' },
        { name: '동남아', href: '/overseas/southeast-asia' },
        { name: '일본', href: '/overseas/japan' },
        { name: '괌/사이판', href: '/overseas/guam' },
        { name: '미주/캐나다/하와이', href: '/overseas/americas' },
        { name: '대만/홍콩/마카오', href: '/overseas/hongkong' },
      ]
    },
    hotel: {
      title: '호텔',
      href: '/hotel/europe',
      items: [
        { name: '유럽', href: '/hotel/europe' },
        { name: '동남아', href: '/hotel/southeast-asia' },
        { name: '일본', href: '/hotel/japan' },
        { name: '괌/사이판', href: '/hotel/guam' },
        { name: '미주/캐나다/하와이', href: '/hotel/americas' },
        { name: '대만/홍콩/마카오', href: '/hotel/hongkong' },
      ]
    },
    domestic: {
      title: '국내',
      href: '/domestic/hotel',
      items: [
        { name: '호텔', href: '/domestic/hotel' },
        { name: '리조트', href: '/domestic/resort' },
        { name: '풀빌라', href: '/domestic/pool-villa' },
      ]
    },
    luxury: {
      title: '럭셔리',
      href: '/luxury/europe',
      items: [
        { name: '유럽', href: '/luxury/europe' },
        { name: '일본', href: '/luxury/japan' },
        { name: '동남아', href: '/luxury/southeast-asia' },
        { name: '크루즈', href: '/luxury/cruise' },
        { name: '이색테마', href: '/luxury/special-theme' },
      ]
    }
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 transition-all">
      <nav className="py-3 md:py-4">
        <div className="max-w-6xl mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 md:gap-2 text-lg md:text-xl font-bold text-blue-500">
              <Plane className="w-5 h-5 md:w-6 md:h-6" />
              TripStore
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {Object.entries(categories).map(([key, category]) => (
                  <li 
                    key={key} 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(key)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-500 transition-colors py-2"
                    >
                      {category.title}
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* 드롭다운 메뉴 */}
                    {activeDropdown === key && (
                      <div className="absolute z-50 top-full left-0 w-64 bg-white shadow-xl rounded-lg border border-gray-100 mt-1">
                        <div className="p-4">
                          <h3 className="font-semibold text-blue-600 mb-3 text-sm uppercase tracking-wide">{category.title}</h3>
                          <div className="space-y-1">
                            {category.items.map((item) => (
                              <Link
                                key={item.name}
                                href={item.href}
                                className="block py-2 px-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-150 text-sm"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
                <li>
                  <Link
                    href="/about"
                    className="font-medium text-gray-700 hover:text-blue-500 transition-colors"
                  >
                    회사소개
                  </Link>
                </li>
              </ul>
              
              <div className="flex gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button 
                        className="flex items-center gap-1 btn btn-sm btn-outline"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        onMouseEnter={() => setShowUserMenu(true)}
                      >
                        <User className="w-4 h-4" />
                        <span>{user?.email?.split('@')[0] || '내 계정'}</span>
                      </button>
                      {showUserMenu && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border border-gray-100 z-50"
                          onMouseEnter={() => setShowUserMenu(true)}
                          onMouseLeave={() => setShowUserMenu(false)}
                        >
                          <div className="p-4">
                            <div className="text-sm text-gray-500 mb-3 pb-2 border-b border-gray-100">{user?.email}</div>
                            <Link 
                              href="/profile" 
                              className="block py-2 px-3 text-sm text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-150"
                              onClick={() => setShowUserMenu(false)}
                            >
                              마이페이지
                            </Link>
                            {isAdmin && (
                              <Link 
                                href="/admin" 
                                className="block py-2 px-3 text-sm text-gray-700 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-all duration-150"
                                onClick={() => setShowUserMenu(false)}
                              >
                                관리자 페이지
                              </Link>
                            )}
                            <button 
                              onClick={() => {
                                handleLogout();
                                setShowUserMenu(false);
                              }}
                              className="flex items-center gap-2 w-full text-left py-2 px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-150 mt-2"
                            >
                              <LogOut className="w-4 h-4" /> 로그아웃
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn btn-outline btn-sm py-1 h-auto min-h-0 md:py-2 md:h-auto">로그인</Link>
                    <Link href="/auth/signup" className="btn btn-primary btn-sm py-1 h-auto min-h-0 md:py-2 md:h-auto">회원가입</Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Mobile navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-100 pt-4">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key} className="border-b border-gray-50 pb-3">
                  <button
                    className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-700 hover:text-blue-500 transition-colors"
                    onClick={() => handleDropdownToggle(key)}
                  >
                    <span>{category.title}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>
                  {activeDropdown === key && (
                    <div className="mt-2 pl-4 space-y-1">
                      {category.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block py-2 text-sm text-gray-600 hover:text-blue-500 hover:bg-blue-50 px-3 rounded-md transition-all duration-150"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-2">
                <Link
                  href="/about"
                  className="block py-1.5 font-medium text-sm text-gray-700 hover:text-blue-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회사소개
                </Link>
              </div>
              <div className="pt-2 space-y-1.5">
                {user ? (
                  <>
                    <div className="px-3 py-1.5 bg-blue-50 rounded-md mb-1.5">
                      <p className="text-xs font-medium">{user?.email?.split('@')[0] || '환영합니다!'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link href="/profile" className="block py-1 text-xs text-gray-700 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      마이페이지
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" className="block py-1 text-xs text-gray-700 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        관리자 페이지
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full btn btn-outline btn-error text-xs h-auto min-h-0 py-1.5 mt-1.5"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="btn btn-outline w-full block text-center h-auto min-h-0 py-2" onClick={() => setIsMenuOpen(false)}>로그인</Link>
                    <Link href="/auth/signup" className="btn btn-primary w-full block text-center h-auto min-h-0 py-2" onClick={() => setIsMenuOpen(false)}>회원가입</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
