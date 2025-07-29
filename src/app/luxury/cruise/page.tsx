'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Crown, Ship, Anchor, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function LuxuryCruisePage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('luxury', 'cruise')
        setHeroImage(image)
        console.log('럭셔리 크루즈 히어로 이미지:', image)
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
  const backgroundImage = heroImage?.image_url || '/images/luxury-cruise-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(30, 58, 138, 0.3) 100%)'
  const title = heroImage?.title || '럭셔리 크루즈'
  const subtitle = heroImage?.subtitle || '세계 최고급 크루즈선에서 펼쳐지는 특별한 해상 여행'

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
                지중해, 카리브해, 북극, 남극
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4 flex-shrink-0" />
                프리미엄 크루즈 라이너
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cruises Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">프리미엄 크루즈 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              세계 각지의 아름다운 바다를 항해하며 즐기는 최고급 크루즈 여행
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentPackages.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🚢</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                현재 등록된 럭셔리 크루즈 패키지가 없습니다
              </h3>
              <p className="text-gray-500 mb-8">
                새로운 패키지가 곧 추가될 예정입니다.
              </p>
              <button 
                onClick={() => router.push('/luxury')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                다른 럭셔리 여행 보기
              </button>
            </div>
          ) : (
            currentPackages.map((cruise: any) => (
              <div key={cruise.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col">
                <div className="relative h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold">{cruise.name || cruise.title}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Crown className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">LUXURY</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{cruise.name || cruise.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{cruise.location}</span>
                  </div>
                  
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {cruise.features?.map((feature: string, index: number) => (
                        <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-lg font-bold text-blue-600">{cruise.price}</span>
                      <span className="text-gray-500 text-sm">/인</span>
                    </div>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/package/${cruise.id}`);
                      }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        </div>
      </section>
    </div>
  )
}
