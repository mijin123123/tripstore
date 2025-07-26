'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Waves, Sun, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function HotelGuamSaipanPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('hotel', 'guam-saipan')
        setHeroImage(image)
        console.log('호텔 괌-사이판 히어로 이미지:', image)
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
      id: 'guam-hotel-1',
      name: '두짓 타니 괌 리조트',
      location: '괌',
      image: '/images/hotel-guam.jpg',
      rating: 5,
      price: '380,000',
      features: ['오션뷰', '인피니티풀', '프라이빗비치', '키즈클럽']
    },
    {
      id: 'saipan-hotel-1',
      name: '하얏트 리젠시 사이판',
      location: '사이판',
      image: '/images/hotel-saipan.jpg',
      rating: 4.8,
      price: '350,000',
      features: ['클럽라운지', '워터파크', '스파', '다이빙']
    },
    {
      id: 'guam-hotel-2',
      name: '더 웨스틴 호텔',
      location: '괌',
      image: '/images/hotel-guam2.jpg',
      rating: 4.7,
      price: '290,000',
      features: ['바다전망', '해변산책로', '수영장', '테니스장']
    },
    {
      id: 'guam-hotel-3',
      name: '더 티파니아 리조트',
      location: '괌',
      image: '/images/hotel-guam3.jpg',
      rating: 4.9,
      price: '420,000',
      features: ['파노라마 뷰', '고급 레스토랑', '인피니티풀', '해양액티비티']
    },
    {
      id: 'saipan-hotel-2',
      name: '사이판 월드 호텔 리조트',
      location: '사이판',
      image: '/images/hotel-saipan2.jpg',
      rating: 4.6,
      price: '310,000',
      features: ['프라이빗', '다이브센터', '전망좋음', '등산']
    },
    {
      id: 'guam-hotel-4',
      name: '오션 뷰 타워 호텔',
      location: '괌',
      image: '/images/hotel-guam4.jpg',
      rating: 4.5,
      price: '270,000',
      features: ['시내중심', '쇼핑몰', '셔틀서비스', '비즈니스센터']
    },
  ];

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/hotel-guam-saipan-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)'
  const title = heroImage?.title || '괌 & 사이판 호텔'
  const subtitle = heroImage?.subtitle || '아름다운 해변과 청정한 바다를 즐길 수 있는 최고급 리조트'

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section 
        className="relative h-80 bg-cover bg-center bg-no-repeat"
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
                <Sun className="w-4 h-4 flex-shrink-0" />
                연중 온화한 날씨
              </span>
              <span className="flex items-center gap-1">
                <Waves className="w-4 h-4 flex-shrink-0" />
                환상적인 해변
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 호텔 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">인기 호텔 및 리조트</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              여유로운 휴식과 아름다운 해변을 배경으로 최신 시설과 서비스를 제공하는 호텔과 리조트
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow h-full flex flex-col h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0 flex-shrink-0">
                  <img 
                    src={hotel.image} 
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{hotel.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 line-clamp-2">{hotel.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{hotel.location}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {hotel.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="bg-cyan-50 text-cyan-600 text-xs px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-cyan-600 line-clamp-2 line-clamp-2">{hotel.price}</span>
                      <span className="text-gray-500 text-xs">/박</span>
                    </div>
                    <button 
                      className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-700 transition-colors"
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
    </div>
  );
}
