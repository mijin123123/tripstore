'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Wifi, Car, Coffee, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function HotelSoutheastAsiaPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('hotel', 'southeast-asia')
        setHeroImage(image)
        console.log('호텔 동남아시아 히어로 이미지:', image)
      } catch (error) {
        console.error('히어로 이미지 로딩 실패:', error)
      }
    }

    loadHeroImage()
  }, [])


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
  const hotels = [
    {
      id: 1,
      name: '발리 리조트 & 스파',
      location: '발리, 인도네시아',
      image: '/images/hotel-bali.jpg',
      rating: 5,
      price: '₩280,000',
      features: ['무한풀', '스파', '해변 접근'],
    },
    {
      id: 2,
      name: '방콕 럭셔리 호텔',
      location: '방콕, 태국',
      image: '/images/hotel-bangkok.jpg',
      rating: 5,
      price: '₩180,000',
      features: ['루프탑 바', '쇼핑몰 연결', '태국 마사지'],
    },
    {
      id: 3,
      name: '푸켓 비치 리조트',
      location: '푸켓, 태국',
      image: '/images/hotel-phuket.jpg',
      rating: 4,
      price: '₩220,000',
      features: ['프라이빗 비치', '수상 스포츠', '키즈 클럽'],
    },
  ]

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/hotel-southeast-asia-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(22, 163, 74, 0.3) 0%, rgba(29, 78, 216, 0.3) 100%)'
  const title = heroImage?.title || '동남아 호텔'
  const subtitle = heroImage?.subtitle || '열대의 낙원에서 완벽한 휴양을 경험하세요'

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
                발리, 방콕, 푸켓, 다낭
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 flex-shrink-0" />
                리조트 & 비치 호텔
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 동남아 호텔</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              아름다운 해변과 열대 정원이 있는 동남아의 최고급 리조트에서 특별한 휴가를 즐기세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{hotel.name}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{hotel.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{hotel.location}</span>
                  </div>
                  
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {hotel.features.map((feature, index) => (
                        <span key={index} className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{hotel.price}</span>
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

      {/* Amenities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">호텔 부대시설</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">무료 WiFi</h3>
              <p className="text-gray-600">고속 인터넷을 호텔 전체에서 무료로 이용하세요</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Car className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">공항 셔틀</h3>
              <p className="text-gray-600">공항과 호텔 간 편리한 셔틀 서비스를 제공합니다</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Coffee className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">조식 서비스</h3>
              <p className="text-gray-600">다양한 현지 요리와 국제 요리를 맛보세요</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
