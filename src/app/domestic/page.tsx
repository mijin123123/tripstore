'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Users, Star, Home, Waves, TreePine, Mountain, Heart, Shield, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { getAllPackages } from '@/lib/api'
import { Package } from '@/types'

export default function DomesticPage() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPackages() {
      try {
        const allPackages = await getAllPackages()
        const domesticPackages = allPackages.filter(pkg => pkg.category === 'domestic')
        setPackages(domesticPackages)
      } catch (error) {
        console.error('패키지 데이터를 가져오는데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPackages()
  }, [])

  // 검색 필터링
  const filteredPackages = packages.filter(pkg => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      pkg.title.toLowerCase().includes(term) ||
      pkg.description?.toLowerCase().includes(term) ||
      pkg.region?.toLowerCase().includes(term) ||
      pkg.regionKo?.toLowerCase().includes(term)
    )
  })

  const categories = [
    {
      name: '호텔/리조트',
      slug: 'hotel',
      icon: Home,
      description: '도심 호텔부터 자연 속 리조트까지',
      places: packages.filter(pkg => pkg.title.toLowerCase().includes('호텔') || pkg.title.toLowerCase().includes('리조트')).length,
      rating: 4.7,
      priceRange: '80,000 - 400,000원',
      features: ['도심 접근성', '수영장', '스파', '레스토랑']
    },
    {
      name: '풀빌라/펜션',
      slug: 'pool-villa',
      icon: TreePine,
      description: '프라이빗한 럭셔리 휴식과 아늑한 펜션',
      places: packages.filter(pkg => pkg.title.toLowerCase().includes('풀빌라') || pkg.title.toLowerCase().includes('펜션')).length,
      rating: 4.8,
      priceRange: '150,000 - 800,000원',
      features: ['전용 수영장', '바비큐 시설', '개별 주방', '프라이빗 정원']
    }
  ]

  const popularDestinations = [
    { name: '제주도', count: 120, image: '/images/jeju.jpg' },
    { name: '부산', count: 85, image: '/images/busan.jpg' },
    { name: '강릉', count: 65, image: '/images/gangneung.jpg' },
    { name: '경주', count: 45, image: '/images/gyeongju.jpg' },
    { name: '전주', count: 38, image: '/images/jeonju.jpg' },
    { name: '여수', count: 42, image: '/images/yeosu.jpg' }
  ]

  const domesticFeatures = [
    {
      title: '가까운 거리',
      description: '비행기 없이도 갈 수 있는 편리한 접근성',
      icon: MapPin
    },
    {
      title: '합리적 가격',
      description: '해외 여행보다 경제적인 비용으로 즐기는 휴가',
      icon: Star
    },
    {
      title: '언어 소통',
      description: '언어 걱정 없이 편안한 여행 경험',
      icon: Heart
    },
    {
      title: '안전한 여행',
      description: '응급상황 시 빠른 대응 가능한 안전함',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Hero 섹션 */}
        <div className="relative h-80 rounded-xl mb-12 overflow-hidden">
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/domestic-hero.jpg'), linear-gradient(135deg, #14532d 0%, #166534 50%, #059669 100%)`
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative h-full flex items-center justify-center text-center text-white z-10">
            <div>
              <Mountain className="w-16 h-16 mx-auto mb-4 text-green-300" />
              <h1 className="text-5xl font-bold mb-4">국내 여행</h1>
              <p className="text-xl opacity-90 max-w-2xl">
                아름다운 우리나라 곳곳에서 특별한 추억을 만들어보세요
              </p>
            </div>
          </div>
        </div>

        {/* 검색창 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="국내 여행지를 검색해보세요 (제주도, 부산, 강릉 등)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                "<span className="font-semibold text-green-600">{searchQuery}</span>" 검색 결과
              </p>
            )}
          </div>
        </div>

        {/* 국내 여행 특징 소개 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {domesticFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* 숙박 타입별 카테고리 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">숙박 타입별 추천</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link 
                  key={category.slug}
                  href={`/domestic/${category.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-48 flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <IconComponent className="w-20 h-20 text-white opacity-80" />
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                      <p className="text-sm truncate opacity-90">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{category.places}곳</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{category.rating}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">{category.priceRange}</div>
                    <div className="flex flex-wrap gap-2">
                      {category.features.map((feature, idx) => (
                        <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* 국내 패키지 목록 */}
        {filteredPackages.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              {searchTerm ? `"${searchTerm}" 검색 결과 (${filteredPackages.length}개)` : '국내 여행 패키지'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                // 로딩 상태
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md p-6 h-96">
                      <div className="animate-pulse flex flex-col h-full">
                        <div className="bg-gray-200 h-48 w-full mb-4 rounded"></div>
                        <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
                        <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
                        <div className="bg-gray-200 h-20 w-full mb-4 rounded"></div>
                        <div className="mt-auto flex justify-between">
                          <div className="bg-gray-200 h-6 w-24 rounded"></div>
                          <div className="bg-gray-200 h-8 w-20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                filteredPackages.map((pkg) => (
                  <Link key={pkg.id} href={`/package/${pkg.id}`}>
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group h-full flex flex-col">
                      {/* 이미지 */}
                      <div className="relative h-64 overflow-hidden flex-shrink-0">
                        <img 
                          src={pkg.image} 
                          alt={pkg.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            국내
                          </span>
                        </div>
                      </div>

                      {/* 내용 */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                        
                        <div className="flex items-center gap-1 text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="text-sm truncate">{pkg.regionKo || pkg.region || '지역 정보 없음'}</span>
                        </div>

                        <div className="mb-4 flex-grow">
                          <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                            {pkg.description || "패키지 상세 정보가 준비 중입니다."}
                          </p>
                        </div>

                        {/* 세부 정보 */}
                        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{pkg.duration || "준비중"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">최대 {pkg.max_people || 2}명</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            <span className="text-sm truncate">{pkg.rating || 5}</span>
                          </div>
                        </div>

                        {/* 가격 */}
                        <div className="flex justify-between items-center mt-auto">
                          <div className="flex flex-col">
                            <span className="text-xl font-bold text-green-600">
                              {(typeof pkg.price === 'string' ? parseInt(pkg.price) : pkg.price).toLocaleString()}원
                            </span>
                          </div>
                          <button className="btn btn-primary btn-sm flex-shrink-0">
                            상세보기
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* 인기 여행지 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">인기 여행지</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {popularDestinations.map((destination, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-32">
                  <div className="w-full h-full">
                    {destination.image ? (
                      <img 
                        src={destination.image} 
                        alt={destination.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500"></div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="font-bold">{destination.name}</h3>
                    <p className="text-xs opacity-90">{destination.count}곳</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 국내 여행 혜택 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">국내 여행 특별 혜택</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">즉시 예약</h3>
              <p className="text-gray-600 text-sm line-clamp-3">실시간 예약 확정, 당일 출발도 가능</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">전국 커버</h3>
              <p className="text-gray-600 text-sm line-clamp-3">제주도부터 강원도까지 전국 모든 지역</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">현지 할인</h3>
              <p className="text-gray-600 text-sm line-clamp-3">제휴 업체 할인 혜택 및 쿠폰 제공</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">맞춤 추천</h3>
              <p className="text-gray-600 text-sm line-clamp-3">여행 스타일에 맞는 개인화된 추천</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
