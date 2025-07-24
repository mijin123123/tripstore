'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Bed, Coffee, Car } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'

export default function DomesticHotelPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchDomesticHotels() {
      try {
        console.log('국내 호텔 패키지 조회 시작: type=domestic, region=hotel');
        const hotelData = await getPackagesByTypeAndRegion('domestic', 'hotel');
        console.log('국내 호텔 패키지 조회 결과:', hotelData);
        setPackages(hotelData);
      } catch (error) {
        console.error('국내 호텔 패키지 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDomesticHotels();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-teal-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">국내 호텔</h1>
            <p className="text-xl mb-6">우리나라 곳곳의 아름다운 호텔에서 특별한 휴식을</p>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : packages.length > 0 ? (
              packages.map((packageItem) => (
                <div 
                  key={packageItem.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/package/${packageItem.id}`)}
                >
                  <div className="relative h-48">
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
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">5</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{packageItem.features?.location || packageItem.location || '위치 정보 없음'}</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '편안하고 고급스러운 호텔에서의 특별한 휴식을 즐기세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-green-600">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-gray-500 text-xs">/{packageItem.duration || '1박'}</span>
                      </div>
                      <div className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
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
