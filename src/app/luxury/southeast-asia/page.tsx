'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Crown, Palmtree, Waves, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function LuxurySoutheastAsiaPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('luxury', 'southeast-asia')
        setHeroImage(image)
        console.log('럭셔리 동남아시아 히어로 이미지:', image)
      } catch (error) {
        console.error('히어로 이미지 로딩 실패:', error)
      }
    }

    loadHeroImage()
  }, [])

  // 데이터베이스에서 패키지를 가져오는 로직을 추가하거나 빈 배열로 초기화
  const packages: any[] = [];

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
  const backgroundImage = heroImage?.image_url || '/images/luxury-southeast-asia-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(13, 148, 136, 0.3) 0%, rgba(29, 78, 216, 0.3) 100%)'
  const title = heroImage?.title || '럭셔리 동남아'
  const subtitle = heroImage?.subtitle || '열대 낙원에서 경험하는 최고급 휴양과 서비스'

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
                발리, 몰디브, 태국, 베트남
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4 flex-shrink-0" />
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col h-full flex flex-col h-full flex flex-col h-full flex flex-col h-full flex flex-col h-full flex flex-col h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-teal-400 to-blue-500 flex items-center justify-center">
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 line-clamp-2">{pkg.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{pkg.location}</span>
                  </div>
                  
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, index) => (
                        <span key={index} className="bg-teal-50 text-teal-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 line-clamp-2">{pkg.price}</span>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
