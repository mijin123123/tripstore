'use client'

import './globals.css'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Phone, Mail, Facebook, Instagram, Youtube, ChevronDown, User, UserPlus, LogOut } from 'lucide-react'

function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 로그인 상태 확인
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    
    checkUser()
    
    // 스토리지 변경 이벤트 리스너
    window.addEventListener('storage', checkUser)
    
    return () => {
      window.removeEventListener('storage', checkUser)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.location.href = '/'
  }

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsDropdownOpen(menu)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(null)
    }, 200) // 200ms 지연
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(null)
    }, 200) // 200ms 지연
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      {/* Main Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-blue-600">Trip</span>
              <span className="text-gray-900">Store</span>
            </div>
          </Link>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  {user.name}님 안녕하세요
                </span>
                <Link 
                  href="/mypage" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors p-2 rounded-lg hover:bg-blue-50"
                  title="마이페이지"
                >
                  <User className="w-5 h-5" />
                  <span>마이페이지</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 font-medium transition-colors p-2 rounded-lg hover:bg-red-50"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                  <span>로그아웃</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors p-2 rounded-lg hover:bg-blue-50"
                  title="로그인"
                >
                  <User className="w-5 h-5" />
                  <span>로그인</span>
                </Link>
                <Link 
                  href="/signup" 
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 font-medium transition-colors p-2 rounded-lg hover:bg-blue-50"
                  title="회원가입"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>회원가입</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="p-2 text-gray-700 focus:outline-none">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Category Menu Bar */}
      <div className="border-t border-gray-200 bg-white/98">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center space-x-8 py-3">
            <Link href="/packages" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              전체메뉴
            </Link>
            
            {/* 해외여행 Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('overseas')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none">
                해외여행
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {isDropdownOpen === 'overseas' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <Link href="/category/유럽" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">유럽</Link>
                  <Link href="/category/동남아" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">동남아</Link>
                  <Link href="/category/일본" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">일본</Link>
                  <Link href="/category/중국" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">중국</Link>
                  <Link href="/category/미주%2F하와이%2F중남미" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">미주/하와이/중남미</Link>
                  <Link href="/category/골프" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">골프</Link>
                </div>
              )}
            </div>

            {/* 국내 Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('domestic')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none">
                국내
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {isDropdownOpen === 'domestic' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <Link href="/category/호텔" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">호텔</Link>
                  <Link href="/category/리조트" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">리조트</Link>
                  <Link href="/category/풀빌라" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">풀빌라</Link>
                </div>
              )}
            </div>

            {/* 호텔 Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('hotel')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none">
                호텔
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {isDropdownOpen === 'hotel' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <Link href="/category/호텔-유럽" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">유럽</Link>
                  <Link href="/category/호텔-동남아" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">동남아</Link>
                  <Link href="/category/호텔-일본" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">일본</Link>
                  <Link href="/category/호텔-중국" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">중국</Link>
                  <Link href="/category/호텔-미주%2F하와이%2F중남미" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">미주/하와이/중남미</Link>
                </div>
              )}
            </div>

            {/* 하이클래스 Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('highclass')}
              onMouseLeave={handleMouseLeave}
            >
              <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none">
                하이클래스
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              
              {isDropdownOpen === 'highclass' && (
                <div 
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <Link href="/category/하이클래스-유럽" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">유럽</Link>
                  <Link href="/category/크루즈" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">크루즈</Link>
                  <Link href="/category/하이클래스-일본" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">일본</Link>
                  <Link href="/category/이색테마" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">이색테마</Link>
                  <Link href="/category/럭셔리%20에어텔" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">럭셔리 에어텔</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4">
              <span className="text-blue-400">Trip</span>Store
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              전 세계 어디든, 완벽한 여행을 설계합니다. 
              전문가가 엄선한 여행 패키지로 잊을 수 없는 추억을 만들어보세요.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/packages" className="hover:text-white transition-colors">여행 패키지</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">회사 소개</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-3" />
                1588-0000
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-3" />
                info@tripstore.co.kr
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 mt-1" />
                <span>서울시 강남구 테헤란로 123<br />TripStore 본사</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 TripStore. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            사업자등록번호: 123-45-67890 | 관광사업자등록번호: 제2025-000001호
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <title>TripStore - 전문 여행 패키지</title>
        <meta name="description" content="전 세계 어디든, 완벽한 여행을 설계합니다. 전문가가 엄선한 여행 패키지와 맞춤형 서비스를 경험해보세요." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white">
        <Navigation />
        <div className="pt-16">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
