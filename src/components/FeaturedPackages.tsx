'use client'

import { useEffect, useState } from 'react'
import { Clock, Users, Star, MapPin, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAllPackages } from '@/lib/api'

// API로 가져오는 Package 타입을 바로 사용
import { Package } from '@/types'

const FeaturedPackages = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || ''
  
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayedPackages, setDisplayedPackages] = useState<Package[]>([])
  
  useEffect(() => {
    async function fetchPackages() {
      try {
        const allPackages = await getAllPackages()
        
        // URL에 검색 파라미터가 있는 경우
        if (searchQuery || categoryFilter) {
          let filteredPackages = allPackages
          
          // 카테고리 필터 적용
          if (categoryFilter) {
            filteredPackages = filteredPackages.filter(pkg => pkg.category === categoryFilter)
          }
          
          // 검색어 필터 적용 - 패키지명 우선, 그 다음 설명과 지역
          if (searchQuery) {
            const term = searchQuery.toLowerCase()
            filteredPackages = filteredPackages.filter(pkg => {
              const titleMatch = pkg.title.toLowerCase().includes(term)
              const descriptionMatch = pkg.description?.toLowerCase().includes(term) || false
              const regionMatch = pkg.region?.toLowerCase().includes(term) || false
              const regionKoMatch = pkg.regionKo?.toLowerCase().includes(term) || false
              
              // 패키지명에 일치하는 것을 우선적으로 표시
              return titleMatch || descriptionMatch || regionMatch || regionKoMatch
            })
            
            // 패키지명에 검색어가 포함된 것을 앞으로 정렬
            filteredPackages.sort((a, b) => {
              const aTitle = a.title.toLowerCase().includes(term)
              const bTitle = b.title.toLowerCase().includes(term)
              if (aTitle && !bTitle) return -1
              if (!aTitle && bTitle) return 1
              return 0
            })
          }
          
          setDisplayedPackages(filteredPackages)
          setPackages(filteredPackages)
        } else {
          // 기존 로직: 추천 패키지만 표시
          const featuredPackages = allPackages.filter(pkg => pkg.is_featured === true)
          
          if (featuredPackages.length === 0 && allPackages.length > 0) {
            setDisplayedPackages(allPackages.slice(0, 3))
            setPackages(allPackages.slice(0, 3))
            console.log('추천 패키지가 없어 상위 3개 패키지를 표시합니다')
          } else {
            setDisplayedPackages(featuredPackages)
            setPackages(featuredPackages)
          }
        }
      } catch (error) {
        console.error('패키지를 가져오는 데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPackages()
  }, [searchQuery, categoryFilter])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {searchQuery ? (
            // 검색 결과 헤더
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                "{searchQuery}" 검색 결과
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                전체 패키지 중 {displayedPackages.length}개의 결과를 찾았습니다.
              </p>
              {searchQuery && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => router.push('/')}
                    className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1"
                  >
                    <Search className="w-4 h-4" />
                    검색 초기화
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 기본 헤더
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                인기 여행 패키지
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                전문가가 엄선한 최고의 여행 패키지를 만나보세요. 
                특별한 할인 혜택과 함께 잊지 못할 여행을 경험하실 수 있습니다.
              </p>
            </div>
          )}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            // 로딩 상태 표시
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
          ) : displayedPackages.length === 0 ? (
            // 패키지 없을 때
            <div className="col-span-3 text-center py-12">
              {searchQuery ? (
                <div>
                  <p className="text-gray-600 text-lg">"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
                  <p className="text-gray-500 mt-2">패키지명이나 여행지명을 정확히 입력해보세요.</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 text-lg">추천 패키지가 없습니다.</p>
                  <p className="text-gray-500 mt-2">관리자 페이지에서 패키지를 추가하고 추천 패키지로 설정해주세요.</p>
                </div>
              )}
            </div>
          ) : (
            // 패키지 목록
            displayedPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group h-full flex flex-col"
                onClick={() => router.push(`/package/${pkg.id}`)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      pkg.category === 'overseas' ? 'bg-blue-500' : 
                      pkg.category === 'domestic' ? 'bg-green-500' : 
                      pkg.category === 'luxury' ? 'bg-purple-500' : 'bg-amber-500'
                    }`}>
                      {pkg.category === 'overseas' ? '해외' : pkg.category === 'domestic' ? '국내' : pkg.category === 'luxury' ? '럭셔리' : '패키지'}
                    </span>
                  </div>
                </div>

                {/* Content */}
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

                  {/* Details */}
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
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

                  {/* Price */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex flex-col">
                      <span className={`text-lg font-bold ${
                        pkg.category === 'overseas' ? 'text-blue-600' : 
                        pkg.category === 'domestic' ? 'text-green-600' : 
                        pkg.category === 'luxury' ? 'text-purple-600' : 'text-blue-500'
                      }`}>
                        {(typeof pkg.price === 'string' ? parseInt(pkg.price) : pkg.price).toLocaleString()}원
                      </span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/package/${pkg.id}`);
                      }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedPackages
