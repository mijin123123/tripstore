'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, Calendar, Users, MapPin, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Package } from '@/types/database'

function PackagesContent() {
  const [packages, setPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    destination: '',
    minPrice: '',
    maxPrice: '',
    duration: '',
    sortBy: 'created_at'
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setSearchQuery(search)
    }
    fetchData()
  }, [searchParams])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 패키지 데이터 가져오기
      const { data: packagesData, error: packagesError } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (packagesError) {
        console.error('Packages fetch error:', packagesError)
      } else {
        setPackages(packagesData || [])
        setFilteredPackages(packagesData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    filterPackages()
  }, [packages, searchQuery, filters])

  const filterPackages = () => {
    let filtered = [...packages]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(pkg =>
        pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Destination filter
    if (filters.destination) {
      filtered = filtered.filter(pkg =>
        pkg.destination.toLowerCase().includes(filters.destination.toLowerCase())
      )
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(pkg => pkg.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(pkg => pkg.price <= parseInt(filters.maxPrice))
    }

    // Duration filter
    if (filters.duration) {
      const duration = parseInt(filters.duration)
      filtered = filtered.filter(pkg => pkg.duration === duration)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'duration':
          return a.duration - b.duration
        case 'name':
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredPackages(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">여행 패키지</h1>
          <p className="text-gray-600">전 세계 최고의 여행지로 떠나는 특별한 여행</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="여행지, 패키지명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">목적지</label>
              <input
                type="text"
                placeholder="목적지"
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">최소 가격</label>
              <input
                type="number"
                placeholder="최소 가격"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">최대 가격</label>
              <input
                type="number"
                placeholder="최대 가격"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">정렬</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              >
                <option value="created_at">최신순</option>
                <option value="price_low">가격 낮은순</option>
                <option value="price_high">가격 높은순</option>
                <option value="duration">기간순</option>
                <option value="name">이름순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold">{filteredPackages.length}</span>개의 패키지를 찾았습니다
          </p>
        </div>

        {/* Package Grid */}
        {filteredPackages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600">다른 조건으로 검색해보세요</p>
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

export default function PackagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <PackagesContent />
    </Suspense>
  )
}
