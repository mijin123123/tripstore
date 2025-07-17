'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Filter, SlidersHorizontal } from 'lucide-react'
import { packageApi } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import AuthModal from '../../components/AuthModal'

interface TravelPackage {
  id: string
  title: string
  location: string
  price: number
  original_price: number
  duration: string
  images: string[]
  rating: number
  reviews: number
  highlights: string[]
  departure_date: string
  available_spots: number
}

export default function SearchResults() {
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 3000000])
  const [duration, setDuration] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('일본')
  const [selectedDate, setSelectedDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [packages, setPackages] = useState<TravelPackage[]>([])
  const [loading, setLoading] = useState(true)
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

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null)
        }
      )
      return () => subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packageApi.getAllPackages()
        setPackages(data.map(pkg => ({
          ...pkg,
          images: pkg.images || []
        })))
      } catch (error) {
        console.error('패키지 데이터 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handleSearch = () => {
    console.log('검색:', { searchQuery, selectedDate, travelers })
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

  const sortedResults = [...packages].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      default:
        return b.reviews - a.reviews
    }
  })

  const filteredResults = sortedResults.filter(pkg => {
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1]
    const matchesDuration = duration ? pkg.duration.includes(duration) : true
    const matchesQuery = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        pkg.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesPrice && matchesDuration && matchesQuery
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">여행 패키지를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">TripStore</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary-600">홈</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">패키지</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">항공</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">호텔</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">이벤트</a>
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
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="어디로 여행을 떠나고 싶으신가요?"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  className="pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>1명</option>
                  <option value={2}>2명</option>
                  <option value={3}>3명</option>
                  <option value={4}>4명</option>
                  <option value={5}>5명 이상</option>
                </select>
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                검색
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 hidden lg:block">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">필터</h3>
                <Filter className="h-5 w-5 text-gray-400" />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  가격 범위
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="3000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0원</span>
                    <span>{priceRange[1].toLocaleString()}원</span>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행 기간
                </label>
                <div className="space-y-2">
                  {['3일', '4일', '5일', '6일', '7일', '8일'].map((dur) => (
                    <label key={dur} className="flex items-center">
                      <input
                        type="radio"
                        name="duration"
                        value={dur}
                        checked={duration === dur}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mr-2"
                      />
                      {dur}
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setPriceRange([0, 3000000])
                  setDuration('')
                }}
                className="w-full text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                필터 초기화
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                총 {filteredResults.length}개의 여행 패키지
              </h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  필터
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="popular">인기순</option>
                  <option value="price-low">가격 낮은 순</option>
                  <option value="price-high">가격 높은 순</option>
                  <option value="rating">평점순</option>
                </select>
              </div>
            </div>

            {/* Package Cards */}
            <div className="grid gap-6">
              {filteredResults.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={pkg.images[0] || '/placeholder.jpg'}
                        alt={pkg.title}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{pkg.title}</h3>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm text-gray-600">{pkg.rating} ({pkg.reviews})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{pkg.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{pkg.duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {pkg.highlights.slice(0, 3).map((highlight, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {pkg.price.toLocaleString()}원
                          </span>
                          <span className="text-gray-500 line-through">
                            {pkg.original_price.toLocaleString()}원
                          </span>
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                            {Math.round((1 - pkg.price / pkg.original_price) * 100)}% 할인
                          </span>
                        </div>
                        <button 
                          onClick={() => window.location.href = `/package?id=${pkg.id}`}
                          className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2"
                        >
                          상세보기
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2 text-sm text-gray-600">
                        출발일: {new Date(pkg.departure_date).toLocaleDateString('ko-KR')} | 
                        잔여석: {pkg.available_spots}석
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredResults.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">검색 조건에 맞는 여행 패키지가 없습니다.</p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setPriceRange([0, 3000000])
                    setDuration('')
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700"
                >
                  검색 조건 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
