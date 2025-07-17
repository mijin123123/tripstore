'use client'

import { useState } from 'react'
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Filter, SlidersHorizontal } from 'lucide-react'

interface TravelPackage {
  id: number
  title: string
  location: string
  price: number
  originalPrice: number
  duration: string
  image: string
  rating: number
  reviews: number
  highlights: string[]
  departureDate: string
  availableSpots: number
}

const searchResults: TravelPackage[] = [
  {
    id: 1,
    title: '일본 도쿄 & 오사카 5일',
    location: '일본',
    price: 1200000,
    originalPrice: 1500000,
    duration: '4박 5일',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    rating: 4.8,
    reviews: 324,
    highlights: ['온천 체험', '후지산 투어', '유니버설 스튜디오'],
    departureDate: '2024-03-15',
    availableSpots: 8
  },
  {
    id: 2,
    title: '일본 홋카이도 삿포로 & 하코다테',
    location: '일본',
    price: 1400000,
    originalPrice: 1700000,
    duration: '5박 6일',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    rating: 4.7,
    reviews: 156,
    highlights: ['온천', '게 요리', '눈축제'],
    departureDate: '2024-03-20',
    availableSpots: 12
  },
  {
    id: 3,
    title: '일본 교토 & 나라 전통 문화',
    location: '일본',
    price: 1100000,
    originalPrice: 1300000,
    duration: '3박 4일',
    image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&q=80',
    rating: 4.9,
    reviews: 289,
    highlights: ['사찰 투어', '전통 체험', '벚꽃 명소'],
    departureDate: '2024-03-25',
    availableSpots: 5
  },
  {
    id: 4,
    title: '일본 오키나와 해양 리조트',
    location: '일본',
    price: 1800000,
    originalPrice: 2200000,
    duration: '4박 5일',
    image: 'https://images.unsplash.com/photo-1544369485-7750e0c8f2b6?w=800&q=80',
    rating: 4.6,
    reviews: 412,
    highlights: ['해양 스포츠', '리조트', '전용 해변'],
    departureDate: '2024-03-30',
    availableSpots: 15
  },
  {
    id: 5,
    title: '일본 후쿠오카 & 규슈 투어',
    location: '일본',
    price: 1300000,
    originalPrice: 1600000,
    duration: '4박 5일',
    image: 'https://images.unsplash.com/photo-1576095231164-52d5d8e3c3c4?w=800&q=80',
    rating: 4.5,
    reviews: 198,
    highlights: ['온천', '라멘 투어', '구마모토성'],
    departureDate: '2024-04-05',
    availableSpots: 10
  },
  {
    id: 6,
    title: '일본 도쿄 디즈니랜드 & 후지산',
    location: '일본',
    price: 1600000,
    originalPrice: 1900000,
    duration: '5박 6일',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    rating: 4.8,
    reviews: 567,
    highlights: ['디즈니랜드', '후지산', '온천'],
    departureDate: '2024-04-10',
    availableSpots: 20
  }
]

export default function SearchResults() {
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 3000000])
  const [duration, setDuration] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('일본')
  const [selectedDate, setSelectedDate] = useState('')
  const [travelers, setTravelers] = useState(2)

  const handleSearch = () => {
    console.log('검색:', { searchQuery, selectedDate, travelers })
  }

  const sortedResults = [...searchResults].sort((a, b) => {
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
              <a href="#" className="text-gray-700 hover:text-primary-600">패키지</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">항공</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">호텔</a>
              <a href="#" className="text-gray-700 hover:text-primary-600">이벤트</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-primary-600">로그인</button>
              <button className="btn-primary">회원가입</button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="어디로 떠나시나요?"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">필터</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 text-gray-600"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">가격 범위</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">100만원 이하</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">100만원 - 150만원</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">150만원 - 200만원</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">200만원 이상</span>
                    </label>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="font-medium mb-3">여행 기간</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">3박 4일</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">4박 5일</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">5박 6일</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">6일 이상</span>
                    </label>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-medium mb-3">평점</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm flex items-center">
                        4.5 이상
                        <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm flex items-center">
                        4.0 이상
                        <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm flex items-center">
                        3.5 이상
                        <Star className="h-4 w-4 text-yellow-400 fill-current ml-1" />
                      </span>
                    </label>
                  </div>
                </div>

                {/* Highlights */}
                <div>
                  <h4 className="font-medium mb-3">특징</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">온천 체험</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">문화 체험</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">쇼핑</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm">자연 경관</span>
                    </label>
                  </div>
                </div>

                <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700">
                  필터 적용
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  "{searchQuery}" 검색 결과
                </h2>
                <p className="text-gray-600 mt-1">
                  총 {searchResults.length}개의 여행 패키지
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="popular">인기순</option>
                  <option value="price-low">가격 낮은순</option>
                  <option value="price-high">가격 높은순</option>
                  <option value="rating">평점순</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedResults.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                      {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% 할인
                    </div>
                    <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{pkg.rating}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-lg mb-2">{pkg.title}</h4>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {pkg.location}
                    </p>
                    <p className="text-gray-600 text-sm mb-3">{pkg.duration}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pkg.highlights.map((highlight, index) => (
                        <span key={index} className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-600">
                        출발일: {new Date(pkg.departureDate).toLocaleDateString('ko-KR')}
                      </div>
                      <div className="text-sm text-green-600">
                        잔여 {pkg.availableSpots}석
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg text-gray-400 line-through mr-2">
                          {pkg.originalPrice.toLocaleString()}원
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                          {pkg.price.toLocaleString()}원
                        </span>
                        <p className="text-sm text-gray-500">({pkg.reviews}개 리뷰)</p>
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
                        상세보기
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-2 text-gray-600 hover:text-gray-900">이전</button>
                <button className="px-3 py-2 bg-primary-600 text-white rounded">1</button>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-900">2</button>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-900">3</button>
                <button className="px-3 py-2 text-gray-600 hover:text-gray-900">다음</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
