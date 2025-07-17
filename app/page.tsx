'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Globe, Shield, Award } from 'lucide-react'
import { packageApi } from '../lib/api'
import { supabase } from '../lib/supabase'
import AuthModal from '../components/AuthModal'
import type { Database } from '../lib/supabase'

type PackageRow = Database['public']['Tables']['packages']['Row']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDestination, setSelectedDestination] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [featuredPackages, setFeaturedPackages] = useState<PackageRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  // 사용자 인증 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
    }
    checkUser()

    // 인증 상태 변경 감지
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null)
        }
      )
      return () => subscription.unsubscribe()
    }
  }, [])

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    async function loadFeaturedPackages() {
      try {
        setIsLoading(true)
        const packages = await packageApi.getPopularPackages(4)
        setFeaturedPackages(packages)
      } catch (error) {
        console.error('Error loading featured packages:', error)
        // 에러 시 기본 데이터 사용
        setFeaturedPackages([])
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedPackages()
  }, [])

  const handleSearch = async () => {
    try {
      if (searchQuery.trim()) {
        // 검색 결과 페이지로 이동 (쿼리 파라미터 포함)
        const searchParams = new URLSearchParams({
          q: searchQuery,
          date: selectedDate,
          travelers: travelers.toString()
        })
        window.location.href = `/search?${searchParams.toString()}`
      }
    } catch (error) {
      console.error('Search error:', error)
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">TripStore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary-600">패키지</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">항공</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">호텔</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">이벤트</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">고객센터</a>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">안녕하세요, {user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    로그인
                  </button>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className="btn-primary"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">
              세계 어디든, 특별한 여행을 시작하세요
            </h2>
            <p className="text-xl mb-8">
              전문 여행사 TripStore와 함께하는 맞춤형 해외여행
            </p>
            
            {/* Search Box */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="어디로 떠나시나요?"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                  >
                    <option value={1}>1명</option>
                    <option value={2}>2명</option>
                    <option value={3}>3명</option>
                    <option value={4}>4명</option>
                    <option value={5}>5명+</option>
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  검색
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              왜 TripStore를 선택해야 할까요?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              전문적인 여행 계획부터 안전한 여행까지, 모든 것을 책임지는 여행사입니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">안전한 여행</h4>
              <p className="text-gray-600">24시간 긴급상황 대응 서비스와 여행자 보험으로 안전한 여행을 보장합니다.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">전문 가이드</h4>
              <p className="text-gray-600">현지 전문 가이드와 함께하는 깊이 있는 문화 체험을 제공합니다.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">맞춤형 여행</h4>
              <p className="text-gray-600">개인의 취향과 예산에 맞춘 완전 맞춤형 여행 상품을 제공합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              인기 여행 패키지
            </h3>
            <p className="text-gray-600">
              가장 인기 있는 해외여행 패키지를 만나보세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // 로딩 상태
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="card animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredPackages.map((pkg) => (
                <div key={pkg.id} className="card hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={pkg.images[0] || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'} 
                      alt={pkg.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                    {pkg.original_price > pkg.price && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                        {Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)}% 할인
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2">{pkg.title}</h4>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {pkg.location}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">{pkg.duration}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <span key={index} className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        {pkg.original_price > pkg.price && (
                          <span className="text-sm text-gray-400 line-through mr-2">
                            {pkg.original_price.toLocaleString()}원
                          </span>
                        )}
                        <span className="text-2xl font-bold text-primary-600">
                          {pkg.price.toLocaleString()}원
                        </span>
                        <p className="text-sm text-gray-500">({pkg.reviews}개 리뷰)</p>
                      </div>
                      <button className="btn-primary flex items-center">
                        예약
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold">TripStore</h1>
              </div>
              <p className="text-gray-400">
                전 세계 어디든, 특별한 여행을 만들어드립니다.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">여행 상품</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">아시아 여행</a></li>
                <li><a href="#" className="hover:text-white">유럽 여행</a></li>
                <li><a href="#" className="hover:text-white">미주 여행</a></li>
                <li><a href="#" className="hover:text-white">오세아니아 여행</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">고객지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">예약 안내</a></li>
                <li><a href="#" className="hover:text-white">취소/환불</a></li>
                <li><a href="#" className="hover:text-white">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-white">1:1 문의</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">연락처</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 1588-0000</li>
                <li>📧 help@tripstore.com</li>
                <li>📍 서울시 강남구 테헤란로 123</li>
                <li>🕒 평일 09:00 - 18:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TripStore. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
