'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Crown, Palmtree, Waves } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LuxurySoutheastAsiaPage() {
  const router = useRouter();
  const packages = [
    {
      id: 'luxury-sea-1',
      name: '발리 프라이빗 빌라 리트리트',
      location: '발리, 인도네시아',
      image: '/images/luxury-bali.jpg',
      rating: 5,
      price: '₩2,200,000',
      features: ['프라이빗 빌라', '개인 셰프', '스파 서비스'],
    },
    {
      id: 'luxury-sea-2',
      name: '몰디브 리조트 프리미엄',
      location: '몰디브',
      image: '/images/luxury-maldives.jpg',
      rating: 5,
      price: '₩3,800,000',
      features: ['수상 빌라', '버틀러 서비스', '프라이빗 다이닝'],
    },
    {
      id: 'luxury-sea-3',
      name: '태국 코사무이 럭셔리',
      location: '코사무이, 태국',
      image: '/images/luxury-samui.jpg',
      rating: 5,
      price: '₩1,800,000',
      features: ['비치프론트', '요트 투어', '스파 패키지'],
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-teal-600 to-blue-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">럭셔리 동남아</h1>
            <p className="text-xl mb-6">열대 낙원에서 경험하는 최고급 휴양과 서비스</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                발리, 몰디브, 태국, 베트남
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                트로피컬 럭셔리 리조트
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">프리미엄 동남아 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              에메랄드빛 바다와 열대 자연이 선사하는 최고급 휴양지에서의 특별한 경험
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
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
                        <span key={index} className="bg-teal-50 text-teal-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-teal-600">{pkg.price}</span>
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

      {/* Tropical Luxury Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">트로피컬 럭셔리</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">수상 빌라</h3>
              <p className="text-gray-600">크리스탈 블루 바다 위에 떠있는 프라이빗 빌라에서의 특별한 경험</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palmtree className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">프라이빗 비치</h3>
              <p className="text-gray-600">오직 당신만을 위한 전용 해변에서 완벽한 프라이버시를 만끽</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">버틀러 서비스</h3>
              <p className="text-gray-600">24시간 전담 버틀러가 제공하는 최고급 개인 맞춤 서비스</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
