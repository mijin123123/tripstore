'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Crown, Plane, Car } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LuxuryEuropePage() {
  const router = useRouter();
  const packages = [
    {
      id: 'luxury-1',
      name: '파리 럭셔리 3박4일',
      location: '파리, 프랑스',
      image: '/images/luxury-paris.jpg',
      rating: 5,
      price: '₩2,800,000',
      features: ['5성급 호텔', '미슐랭 3스타', '개인 가이드'],
    },
    {
      id: 'luxury-2',
      name: '스위스 알프스 럭셔리 투어',
      location: '융프라우, 스위스',
      image: '/images/luxury-swiss.jpg',
      rating: 5,
      price: '₩3,200,000',
      features: ['산악 리조트', '개인 셰프', '헬기 투어'],
    },
    {
      id: 'luxury-3',
      name: '이탈리아 토스카나 와이너리',
      location: '토스카나, 이탈리아',
      image: '/images/luxury-tuscany.jpg',
      rating: 5,
      price: '₩2,500,000',
      features: ['와이너리 투어', '요리 클래스', '고급 숙소'],
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">럭셔리 유럽</h1>
            <p className="text-xl mb-6">유럽의 격조 높은 문화와 최고급 서비스를 경험하세요</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                파리, 스위스, 이탈리아, 영국
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                프리미엄 럭셔리 투어
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">프리미엄 유럽 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              세계 최고 수준의 서비스와 특별한 경험으로 완성되는 럭셔리 유럽 여행
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{pkg.name}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Crown className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">LUXURY</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{pkg.location}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, index) => (
                        <span key={index} className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-purple-600">{pkg.price}</span>
                      <span className="text-gray-500 text-xs">/인</span>
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
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">럭셔리 서비스</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">프라이빗 제트</h3>
              <p className="text-gray-600">최고급 프라이빗 제트로 편안하고 품격 있는 이동</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">VIP 서비스</h3>
              <p className="text-gray-600">24시간 전담 컨시어지와 개인 맞춤 서비스</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">전용 차량</h3>
              <p className="text-gray-600">럭셔리 차량과 전문 드라이버가 함께하는 이동</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
