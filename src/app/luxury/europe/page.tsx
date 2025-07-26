'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Crown, Plane, Car, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function LuxuryEuropePage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('luxury', 'europe')
        setHeroImage(image)
        console.log('럭셔리 유럽 히어로 이미지:', image)
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

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/luxury-europe-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(219, 39, 119, 0.3) 100%)'
  const title = heroImage?.title || '럭셔리 유럽'
  const subtitle = heroImage?.subtitle || '유럽의 격조 높은 문화와 최고급 서비스를 경험하세요'

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
                파리, 스위스, 이탈리아, 영국
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4 flex-shrink-0" />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{pkg.name}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Crown className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">LUXURY</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{pkg.location}</span>
                  </div>
                  
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, index) => (
                        <span key={index} className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.price}</span>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
