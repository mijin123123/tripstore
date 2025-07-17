'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Package } from '@/types/database'
import { Search, Calendar, Users, Star, ArrowRight, Plane, MapPin, Clock } from 'lucide-react'

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedPackages()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .eq('is_active', true)
        .order('sort_order')

      if (error) {
        console.error('Categories error:', error)
        return
      }
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchFeaturedPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Supabase error:', error)
        setFeaturedPackages([])
        return
      }
      setFeaturedPackages(data || [])
    } catch (error) {
      console.error('Error fetching packages:', error)
      setFeaturedPackages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/packages?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const getCategoryImage = (categoryName: string) => {
    const imageMap: { [key: string]: string } = {
      '해외여행': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      '국내': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      '호텔': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
      '하이클래스': 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400'
    }
    return imageMap[categoryName] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400'
  }

  return (
    <main className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
            alt="Beautiful travel destination"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-indigo-800/30 to-purple-900/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
              특별한 여행을
              <span className="text-blue-300 block">시작하세요</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow-md">
              전 세계 최고의 여행지에서 만나는 잊을 수 없는 경험과 추억
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-2">
              <div className="flex items-center">
                <div className="flex-1 flex items-center px-4">
                  <Search className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="어디로 떠나고 싶으신가요?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full py-4 text-gray-900 placeholder-gray-500 border-none focus:outline-none text-lg bg-transparent"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  검색
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">150+</div>
                <div className="text-white/80 text-sm font-medium">여행 패키지</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">98%</div>
                <div className="text-white/80 text-sm font-medium">고객 만족도</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">24/7</div>
                <div className="text-white/80 text-sm font-medium">고객 지원</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">5K+</div>
                <div className="text-white/80 text-sm font-medium">만족한 고객</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex flex-col items-center animate-bounce">
            <span className="text-white/80 text-sm mb-2">더 많은 여행 상품 보기</span>
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            인기 여행지
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/packages?category=${category.id}`}
                className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none"
              >
                <div className="aspect-[4/3]">
                  <img 
                    src={category.image_url || getCategoryImage(category.name)} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors">
                    <div className="absolute bottom-3 left-3 text-white">
                      <h3 className="text-lg font-bold">{category.name}</h3>
                      <p className="text-xs opacity-90">{category.description || '다양한 상품'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">추천 여행 패키지</h2>
            <Link 
              href="/packages" 
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              전체보기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredPackages.map((pkg) => (
                <Link 
                  key={pkg.id} 
                  href={`/packages/${pkg.id}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                >
                  <div className="aspect-[5/4] relative overflow-hidden">
                    <img 
                      src={pkg.image_url || '/placeholder-travel.jpg'} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                        {pkg.duration}일
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="text-xs text-gray-500 mb-1">
                      {pkg.destination}
                    </div>
                    
                    <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {pkg.title}
                    </h3>
                    
                    <p className="text-gray-600 text-xs mb-2 line-clamp-1">
                      {pkg.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <div>{new Date(pkg.departure_date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</div>
                      <div>{pkg.max_people - pkg.current_bookings}자리</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-blue-600">
                        {pkg.price.toLocaleString()}원
                      </div>
                      <div className="text-xs text-gray-500">1인당</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Service Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            TripStore만의 특별함
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">프리미엄 서비스</h3>
              <p className="text-gray-600">
                20년 경험의 전문 여행 컨설턴트가 고객님만을 위한 맞춤 여행을 제안해드립니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">안전한 여행</h3>
              <p className="text-gray-600">
                24시간 고객지원과 현지 응급상황 대응 서비스로 안전하고 편안한 여행을 보장합니다.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">최저가 보장</h3>
              <p className="text-gray-600">
                동일 상품 더 저렴한 가격 발견 시 차액을 환불해드리는 최저가 보장 정책을 운영합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
