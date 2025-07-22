'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Plane, User, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const Header = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // 로그인 상태 확인
  useEffect(() => {
    const supabase = createClient()
    
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('인증 확인 오류:', error)
          setUser(null)
        } else if (session) {
          // 사용자 데이터 가져오기
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          console.log('사용자 데이터 조회 결과:', userData)
          setUser(userData || { email: session.user.email })
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('인증 확인 중 오류:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    
    // 초기 인증 상태 확인
    checkAuth()
    
    // 인증 상태 변화 이벤트 구독
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('인증 상태 변경:', event, session?.user?.id)
        
        if (event === 'SIGNED_IN' && session) {
          // 로그인 이벤트
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          console.log('로그인 후 사용자 데이터:', userData)
          setUser(userData || { email: session.user.email })
        } else if (event === 'SIGNED_OUT') {
          // 로그아웃 이벤트
          setUser(null)
        }
      }
    )
    
    // 클린업 함수
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])
  
  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
      }
    }
  }, [dropdownTimeout])
  
  // 관리자 페이지에서는 헤더를 표시하지 않음
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      window.location.href = '/'
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

  const handleMouseEnter = (category: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(category)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms 지연으로 안정성 확보
    setDropdownTimeout(timeout)
  }

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
  }

  const categories = {
    overseas: {
      title: '해외여행',
      href: '/overseas/europe',
      items: [
        { name: '유럽', href: '/overseas/europe' },
        { name: '동남아', href: '/overseas/southeast-asia' },
        { name: '일본', href: '/overseas/japan' },
        { name: '괌/사이판', href: '/overseas/guam-saipan' },
        { name: '미주/캐나다/하와이', href: '/overseas/americas' },
        { name: '대만/홍콩/마카오', href: '/overseas/china-hongkong' },
      ]
    },
    hotel: {
      title: '호텔',
      href: '/hotel/europe',
      items: [
        { name: '유럽', href: '/hotel/europe' },
        { name: '동남아', href: '/hotel/southeast-asia' },
        { name: '일본', href: '/hotel/japan' },
        { name: '괌/사이판', href: '/hotel/guam-saipan' },
        { name: '미주/캐나다/하와이', href: '/hotel/americas' },
        { name: '대만/홍콩/마카오', href: '/hotel/china-hongkong' },
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
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 z-[100] transition-all">
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
                    onMouseEnter={() => handleMouseEnter(key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={category.href}
                      className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-500 transition-colors"
                    >
                      {category.title}
                      <ChevronDown className="w-4 h-4" />
                    </Link>

                    <div 
                      className={`absolute z-50 top-full left-0 w-64 bg-white shadow-lg rounded-md border border-gray-100 mt-1
                        ${activeDropdown === key ? 'block' : 'hidden'}`}
                      onMouseEnter={handleDropdownMouseEnter}
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-blue-600 mb-2">{category.title}</h3>
                        <div className="grid gap-1">
                          {category.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="py-1 text-gray-600 hover:text-blue-500 transition-colors"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
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
                        <span>{user.name || '내 계정'}</span>
                      </button>
                      {showUserMenu && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
                          onMouseEnter={() => setShowUserMenu(true)}
                          onMouseLeave={() => setShowUserMenu(false)}
                        >
                          <div className="p-3">
                            <div className="text-sm text-gray-500 mb-2">{user.email}</div>
                            <Link href="/profile" className="block py-2 text-sm text-gray-700 hover:text-blue-500 transition-colors">
                              마이페이지
                            </Link>
                            {user.is_admin && (
                              <Link href="/admin" className="block py-2 text-sm text-gray-700 hover:text-blue-500 transition-colors">
                                관리자 페이지
                              </Link>
                            )}
                            <button 
                              onClick={handleLogout}
                              className="flex items-center gap-1 w-full text-left py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                              <LogOut className="w-4 h-4 mr-1" /> 로그아웃
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
          <div 
            className={`md:hidden transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
            }`}
          >
            <div className="py-4 space-y-4">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key}>
                  <button
                    className="flex items-center justify-between w-full py-1.5 border-b border-gray-100 text-sm"
                    onClick={() => handleDropdownToggle(key)}
                  >
                    <span className="font-medium">{category.title}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === key ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`pl-3 py-1 space-y-0.5 ${
                    activeDropdown === key ? 'block' : 'hidden'
                  }`}>
                    {category.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-0.5 text-xs text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
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
                      <p className="text-xs font-medium">{user.name || '환영합니다!'}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block py-1 text-xs text-gray-700 hover:text-blue-500 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      마이페이지
                    </Link>
                    {user.is_admin && (
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
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
