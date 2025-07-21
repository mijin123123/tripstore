'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown, Plane } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)

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

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout)
      }
    }
  }, [dropdownTimeout])

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
      <nav className="py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-500">
              <Plane className="w-6 h-6" />
              TripStore
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-6">
                {Object.entries(categories).map(([key, category]) => (
                  <li 
                    key={key} 
                    className="relative group nav-item"
                    onMouseEnter={() => handleMouseEnter(key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={category.href}
                      className="flex items-center gap-1 font-medium text-gray-700 hover:text-blue-500 transition-colors py-2"
                    >
                      {category.title}
                      <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                    </Link>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className={`absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[110] transition-all duration-200 ease-in-out ${
                        activeDropdown === key ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      }`}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="py-2">
                        {category.items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-500 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
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
                <Link href="/auth/login" className="btn btn-outline btn-sm">로그인</Link>
                <Link href="/auth/signup" className="btn btn-primary btn-sm">회원가입</Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="py-4 space-y-4">
              {Object.entries(categories).map(([key, category]) => (
                <div key={key}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={category.href}
                      className="font-medium text-gray-700 hover:text-blue-500"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.title}
                    </Link>
                    <button
                      className="p-1"
                      onClick={() => handleDropdownToggle(key)}
                      aria-label={`Toggle ${category.title} submenu`}
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === key ? 'rotate-180' : ''
                      }`} />
                    </button>
                  </div>
                  
                  <div className={`ml-4 mt-2 space-y-1 transition-all duration-200 ${
                    activeDropdown === key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}>
                    {category.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block py-1 text-sm text-gray-600 hover:text-blue-500 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-4">
                <Link
                  href="/about"
                  className="block py-2 font-medium text-gray-700 hover:text-blue-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  회사소개
                </Link>
              </div>
              <div className="pt-4 space-y-2">
                <Link href="/auth/login" className="btn btn-outline w-full block text-center" onClick={() => setIsMenuOpen(false)}>로그인</Link>
                <Link href="/auth/signup" className="btn btn-primary w-full block text-center" onClick={() => setIsMenuOpen(false)}>회원가입</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
