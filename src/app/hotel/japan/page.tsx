'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Mountain, Waves } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function HotelJapanPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('hotel', 'japan')
        setHeroImage(image)
        console.log('호텔 일본 히어로 이미지:', image)
      } catch (error) {
        console.error('히어로 이미지 로딩 실패:', error)
      }
    }

    loadHeroImage()
  }, [])

  const hotels = [
    {
      id: 1,
      name: '교토 전통 료칸',
      location: '교토, 일본',
      image: '/images/hotel-kyoto.jpg',
      rating: 5,
      price: '₩320,000',
      features: ['온천', '가이세키 요리', '정원 뷰'],
    },
    {
      id: 2,
      name: '도쿄 모던 호텔',
      location: '도쿄, 일본',
      image: '/images/hotel-tokyo.jpg',
      rating: 5,
      price: '₩280,000',
      features: ['스카이라인 뷰', '미슐랭 레스토랑', '최신 시설'],
    },
    {
      id: 3,
      name: '하코네 온천 료칸',
      location: '하코네, 일본',
      image: '/images/hotel-hakone.jpg',
      rating: 4,
      price: '₩380,000',
      features: ['후지산 뷰', '노천온천', '전통 체험'],
    },
  ]

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/hotel-japan-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(220, 38, 127, 0.3) 0%, rgba(239, 68, 68, 0.3) 100%)'
  const title = heroImage?.title || '일본 호텔'
  const subtitle = heroImage?.subtitle || '전통과 현대가 조화된 일본의 특별한 숙박 경험'

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
                도쿄, 교토, 오사카, 하코네
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                료칸 & 모던 호텔
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 일본 호텔</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              일본의 전통 료칸부터 모던한 도심 호텔까지, 다양한 스타일의 숙박을 경험해보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-red-400 to-pink-500 flex items-center justify-center">
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
                        <span key={index} className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-red-600">{hotel.price}</span>
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

      {/* Japanese Experience Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">일본 호텔 특별 경험</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">온천 체험</h3>
              <p className="text-gray-600">천연 온천수에서 일본 전통 목욕 문화를 경험하세요</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">가이세키 요리</h3>
              <p className="text-gray-600">계절의 맛을 담은 일본 전통 정식 요리를 맛보세요</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">후지산 뷰</h3>
              <p className="text-gray-600">일본의 상징 후지산을 바라보며 특별한 추억을 만드세요</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
