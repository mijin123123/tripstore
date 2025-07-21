'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Bed, Coffee, Car } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DomesticHotelPage() {
  const router = useRouter();
  const hotels = [
    {
      id: 1,
      name: '서울 강남 프리미엄 호텔',
      location: '서울 강남구',
      image: '/images/hotel-seoul.jpg',
      rating: 5,
      price: '₩280,000',
      features: ['강남역 근처', '비즈니스 센터', '스카이라운지'],
    },
    {
      id: 2,
      name: '부산 해운대 오션뷰 호텔',
      location: '부산 해운대구',
      image: '/images/hotel-busan.jpg',
      rating: 5,
      price: '₩220,000',
      features: ['해운대 해변', '오션뷰', '실내 수영장'],
    },
    {
      id: 3,
      name: '제주 서귀포 리조트 호텔',
      location: '제주 서귀포시',
      image: '/images/hotel-jeju.jpg',
      rating: 4,
      price: '₩180,000',
      features: ['한라산 뷰', '온천', '골프장'],
    },
  ]

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
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
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
                        <span key={index} className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-green-600">{hotel.price}</span>
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
