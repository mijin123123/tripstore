'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'

export default function HotelEuropePage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchEuropeHotels() {
      try {
        console.log('유럽 호텔 패키지 조회 시작: type=hotel, region=europe');
        const hotelData = await getPackagesByTypeAndRegion('hotel', 'europe');
        console.log('유럽 호텔 패키지 조회 결과:', hotelData);
        setPackages(hotelData);
      } catch (error) {
        console.error('유럽 호텔 패키지 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchEuropeHotels();
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">유럽 호텔</h1>
            <p className="text-xl mb-6">유럽의 아름다운 도시에서 특별한 숙박 경험을 만나보세요</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                파리, 런던, 로마, 바르셀로나
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                5성급 럭셔리 호텔
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 유럽 호텔</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              엄선된 유럽의 프리미엄 호텔에서 잊을 수 없는 여행의 추억을 만들어보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{hotel.name}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hotel.location}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {hotel.features.map((feature, index) => (
                        <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-blue-600">{hotel.price}</span>
                      <span className="text-gray-500 text-xs">/박</span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/package/${hotel.id}`);
                      }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">유럽 호텔 특징</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
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
  )
}
