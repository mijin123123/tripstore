'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Bed, Coffee, Car, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function DomesticHotelPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const packagesPerPage = 12
  
  useEffect(() => {
    async function fetchData() {
      try {
        // 패키지 데이터와 히어로 이미지를 병렬로 가져오기
        const [hotelData, heroImageData] = await Promise.all([
          getPackagesByTypeAndRegion('domestic', 'hotel'),
          getHeroImage('domestic', 'hotel')
        ])
        
        console.log('국내 호텔 패키지 조회 결과:', hotelData);
        console.log('국내 호텔 히어로 이미지:', heroImageData)
        
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
  const backgroundImage = heroImage?.image_url || '/images/domestic-hotel-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(22, 163, 74, 0.3) 0%, rgba(20, 184, 166, 0.3) 100%)'
  const title = heroImage?.title || '국내 호텔'
  const subtitle = heroImage?.subtitle || '우리나라 곳곳의 아름다운 호텔에서 특별한 휴식을'

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
                <MapPin className="w-4 h-4" />
                서울, 부산, 제주, 강릉
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                도심 호텔 & 리조트
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 국내 호텔</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              전국 각지의 프리미엄 호텔에서 편안하고 특별한 휴식을 만끽하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                        <span className="text-white font-semibold">{packageItem.title || packageItem.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{packageItem.location || '위치 정보 없음'}</span>
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '편안하고 고급스러운 호텔에서의 특별한 휴식을 즐기세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-green-600">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-gray-500 text-xs">/{packageItem.duration || '1박'}</span>
                      </div>
                      <div className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">
                        상세보기
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">등록된 국내 호텔 패키지가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">관리자가 곧 새로운 패키지를 추가할 예정입니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {packages.length > packagesPerPage && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                이전
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                다음
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">호텔 서비스</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">편안한 객실</h3>
              <p className="text-gray-600">최고급 침구와 어메니티로 완벽한 휴식을 제공합니다</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">조식 서비스</h3>
              <p className="text-gray-600">신선한 재료로 준비한 다양한 한식과 양식 조식</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">교통 편의</h3>
              <p className="text-gray-600">주요 교통편과 관광지까지의 편리한 접근성</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
