'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function HotelEuropePage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        // 패키지 데이터와 히어로 이미지를 병렬로 가져오기
        const [hotelData, heroImageData] = await Promise.all([
          getPackagesByTypeAndRegion('hotel', 'europe'),
          getHeroImage('hotel', 'europe')
        ])
        
        console.log('유럽 호텔 패키지 조회 결과:', hotelData);
        console.log('호텔 유럽 히어로 이미지:', heroImageData)
        
        setPackages(hotelData);
        setHeroImage(heroImageData)
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);


  // 페이지네이션 계산
  const totalPages = Math.ceil(packages.length / packagesPerPage)
  const startIndex = (currentPage - 1) * packagesPerPage
  const endIndex = startIndex + packagesPerPage
  const currentPackages = packages.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/hotel-europe-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)'
  const title = heroImage?.title || '유럽 호텔'
  const subtitle = heroImage?.subtitle || '유럽의 아름다운 도시에서 특별한 숙박 경험을 만나보세요'

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `${gradientOverlay}, url('${backgroundImage}')`
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
            <p className="text-xl mb-6">{subtitle}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                파리, 런던, 로마, 바르셀로나
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 flex-shrink-0" />
                5성급 럭셔리 호텔
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 유럽 호텔</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              유럽 주요 도시의 최고급 호텔에서 특별한 숙박 경험을 선사합니다
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : packages.length > 0 ? (
              currentPackages.map((packageItem) => (
                <div 
                  key={packageItem.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => router.push(`/package/${packageItem.id}`)}
                >
                  <div className="relative h-48 flex-shrink-0">
                    {packageItem.image ? (
                      <img 
                        src={packageItem.image} 
                        alt={packageItem.title || packageItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white font-semibold">{packageItem.title || packageItem.name}</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">5</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      유럽호텔
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{
                        (typeof packageItem.features === 'object' && !Array.isArray(packageItem.features) && packageItem.features?.location) || 
                        packageItem.location || 
                        '유럽'
                      }</span>
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '유럽의 아름다운 도시에서 특별한 숙박 경험을 만나보세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{packageItem.duration || '4박 5일'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>디럭스룸</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-gray-500 text-sm block">/{packageItem.duration || '1박'}</span>
                      </div>
                      <div className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0">
                        예약하기
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">등록된 유럽 호텔 패키지가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">관리자가 곧 새로운 패키지를 추가할 예정입니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 호텔 특징 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">유럽 호텔 특징</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">럭셔리 서비스</h3>
              <p className="text-gray-600">세계적인 수준의 5성급 호텔 서비스를 경험해보세요</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">최적의 위치</h3>
              <p className="text-gray-600">주요 관광지와 가까운 최고의 접근성을 제공합니다</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">맞춤 서비스</h3>
              <p className="text-gray-600">개인의 취향에 맞는 맞춤형 호텔 서비스</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
