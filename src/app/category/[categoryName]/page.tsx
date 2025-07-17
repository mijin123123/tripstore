'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Calendar, Users, MapPin, Star, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Package } from '@/types/database'

// 카테고리 이름 매핑
const categoryDisplayNames: { [key: string]: string } = {
  '유럽': '유럽',
  '동남아': '동남아',
  '일본': '일본',
  '중국': '중국',
  '미주%2F하와이%2F중남미': '미주/하와이/중남미',
  '골프': '골프',
  '호텔': '호텔',
  '리조트': '리조트',
  '풀빌라': '풀빌라',
  '호텔-유럽': '호텔-유럽',
  '호텔-동남아': '호텔-동남아',
  '호텔-일본': '호텔-일본',
  '호텔-중국': '호텔-중국',
  '호텔-미주%2F하와이%2F중남미': '호텔-미주/하와이/중남미',
  '하이클래스-유럽': '하이클래스-유럽',
  '크루즈': '크루즈',
  '하이클래스-일본': '하이클래스-일본',
  '이색테마': '이색테마',
  '럭셔리%20에어텔': '럭셔리 에어텔'
}

export default function CategoryPage() {
  const params = useParams()
  const categoryName = decodeURIComponent(params.categoryName as string)
  const displayName = categoryDisplayNames[params.categoryName as string] || categoryName
  
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    duration: '',
    sortBy: 'created_at'
  })

  useEffect(() => {
    fetchData()
  }, [categoryName])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 패키지 데이터 가져오기 (카테고리별 필터링)
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .eq('category', categoryName)
        .order('created_at', { ascending: false })

      // 카테고리가 없는 경우, destination이나 title로 필터링 시도
      if (!packagesData || packagesData.length === 0) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .or(`destination.ilike.%${categoryName}%,title.ilike.%${categoryName}%`)
          .order('created_at', { ascending: false })
        
        if (!fallbackError && fallbackData) {
          setPackages(fallbackData)
          setFilteredPackages(fallbackData)
        }
      } else {
        setPackages(packagesData)
        setFilteredPackages(packagesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...packages]

    // 검색어 필터
    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 가격 필터
    if (filters.minPrice) {
      filtered = filtered.filter(pkg => pkg.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(pkg => pkg.price <= parseInt(filters.maxPrice))
    }

    // 기간 필터
    if (filters.duration) {
      filtered = filtered.filter(pkg => pkg.duration.toString() === filters.duration)
    }

    // 정렬
    switch (filters.sortBy) {
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration)
        break
      case 'rating':
        // rating 속성이 없으므로 정렬하지 않음
        break
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredPackages(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [searchQuery, filters, packages])

  const resetFilters = () => {
    setSearchQuery('')
    setFilters({
      minPrice: '',
      maxPrice: '',
      duration: '',
      sortBy: 'created_at'
    })
  }

  // 로딩 스켈레톤 컴포넌트
  const PackageSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="aspect-[5/4] bg-gray-200"></div>
      <div className="p-3">
        <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="h-3 bg-gray-200 rounded w-12"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-3 bg-gray-200 rounded w-8"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 및 페이지 타이틀 */}
        <div className="mb-8">
          <Link 
            href="/packages" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            전체 패키지로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {displayName} 여행 패키지
          </h1>
          <p className="text-gray-600">
            {displayName} 지역의 다양한 여행 패키지를 만나보세요
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {/* 검색바 */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="여행지나 패키지명으로 검색하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 필터 옵션 */}
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">최소 가격</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">최대 가격</label>
              <input
                type="number"
                placeholder="9999999"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">여행 기간</label>
              <select
                value={filters.duration}
                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">전체</option>
                <option value="3">3일</option>
                <option value="4">4일</option>
                <option value="5">5일</option>
                <option value="6">6일</option>
                <option value="7">7일</option>
                <option value="8">8일 이상</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">최신순</option>
                <option value="price_low">가격 낮은순</option>
                <option value="price_high">가격 높은순</option>
                <option value="duration">여행기간순</option>
                <option value="rating">평점순</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 {filteredPackages.length}개의 패키지
            </p>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* 패키지 목록 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <PackageSkeleton key={index} />
            ))}
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-6">
              다른 검색어를 입력하거나 필터를 조정해보세요
            </p>
            <button
              onClick={resetFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPackages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/packages/${pkg.id}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 focus:outline-none"
              >
                <div className="aspect-[5/4] relative bg-gray-200">
                  {pkg.image_url ? (
                    <img
                      src={pkg.image_url}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {pkg.destination}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-2 py-0.5 rounded">
                    <span className="text-xs font-semibold text-gray-800">
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
                    <span className="text-sm font-bold text-blue-600">
                      {pkg.price.toLocaleString()}원
                    </span>
                    <span className="text-xs text-gray-500">
                      1인당
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
