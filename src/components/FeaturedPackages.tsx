'use client'

import { useEffect, useState } from 'react'
import { Clock, Users, Star, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getAllPackages } from '@/lib/api'

// API로 가져오는 Package 타입을 바로 사용
import { Package } from '@/types'

const FeaturedPackages = () => {
  const router = useRouter()
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    async function fetchPackages() {
      try {
        const allPackages = await getAllPackages()
        // 추천 패키지만 필터링
        const featuredPackages = allPackages.filter(pkg => pkg.is_featured)
        setPackages(featuredPackages)
      } catch (error) {
        console.error('패키지를 가져오는 데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPackages()
  }, [])

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            인기 여행 패키지
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            전문가가 엄선한 최고의 여행 패키지를 만나보세요. 
            특별한 할인 혜택과 함께 잊지 못할 여행을 경험하실 수 있습니다.
          </p>
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
          ) : packages.length === 0 ? (
            // 패키지 없을 때
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-600 text-lg">추천 패키지가 없습니다.</p>
              <p className="text-gray-500 mt-2">관리자 페이지에서 패키지를 추가하고 추천 패키지로 설정해주세요.</p>
            </div>
          ) : (
            // 패키지 목록
            packages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => router.push(`/package/${pkg.id}`)}
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {pkg.type === 'overseas' ? '해외' : pkg.type === 'domestic' ? '국내' : pkg.type === 'luxury' ? '럭셔리' : '호텔'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{pkg.regionKo}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Details */}
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>최대 {pkg.max_people}명</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{pkg.rating}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex justify-between items-center">
                    <div className="text-xl font-bold text-blue-500">
                      {parseInt(pkg.price).toLocaleString()}
                      <span className="text-xs text-gray-500 ml-1">원</span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
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
