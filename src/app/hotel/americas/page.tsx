'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, Calendar, Building, Camera, Music, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function HotelAmericasPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)

  useEffect(() => {
    async function loadHeroImage() {
      try {
        const image = await getHeroImage('hotel', 'americas')
        setHeroImage(image)
        console.log('호텔 아메리카 히어로 이미지:', image)
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
      id: 'americas-hotel-1',
      name: '뉴욕 타임스퀘어 호텔',
      location: '뉴욕, 미국',
      image: '/images/hotel-newyork.jpg',
      rating: 5,
      price: '450,000',
      features: ['중심 위치', '브로드웨이 근처', '루프탑 바'],
    },
    {
      id: 'americas-hotel-2',
      name: '하와이 와이키키 리조트',
      location: '호놀룰루, 하와이',
      image: '/images/hotel-hawaii.jpg',
      rating: 5,
      price: '480,000',
      features: ['오션뷰', '서핑 레슨', '루아우쇼'],
    },
    {
      id: 'americas-hotel-3',
      name: '밴쿠버 하버뷰 호텔',
      location: '밴쿠버, 캐나다',
      image: '/images/hotel-vancouver.jpg',
      rating: 4.7,
      price: '320,000',
      features: ['하버뷰', '스키장 근처', '스파'],
    },
    {
      id: 'americas-hotel-4',
      name: '라스베가스 럭셔리 리조트',
      location: '라스베가스, 미국',
      image: '/images/hotel-lasvegas.jpg',
      rating: 4.9,
      price: '390,000',
      features: ['카지노', '쇼', '수영장'],
    },
    {
      id: 'americas-hotel-5',
      name: '마이애미 비치 호텔',
      location: '마이애미, 미국',
      image: '/images/hotel-miami.jpg',
      rating: 4.8,
      price: '370,000',
      features: ['비치프론트', '아트데코', '루프탑 풀'],
    },
    {
      id: 'americas-hotel-6',
      name: '토론토 다운타운 호텔',
      location: '토론토, 캐나다',
      image: '/images/hotel-toronto.jpg',
      rating: 4.6,
      price: '290,000',
      features: ['시내 중심', 'CN타워 전망', '비즈니스 센터'],
    }
  ];

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/hotel-americas-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)'
  const title = heroImage?.title || '미주/캐나다/하와이 호텔'
  const subtitle = heroImage?.subtitle || '북미 대륙의 다채로운 매력을 만나보세요'

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
                뉴욕, 라스베가스, 하와이, 밴쿠버
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                최고급 호텔 & 리조트
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 미주 호텔</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              세계적인 도시와 아름다운 자연을 경험할 수 있는 북미 최고의 호텔들을 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" onClick={() => router.push(`/package/${hotel.id}`)}>
                <div className="relative h-48 flex-shrink-0 flex-shrink-0">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate font-semibold">{hotel.rating}</span>
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
                        <span key={index} className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 mb-2">{hotel.price}</span>
                      <span className="text-gray-500 text-xs">/박</span>
                    </div>
                    <button 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
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

      {/* City Highlights Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">도시별 하이라이트</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">중심 명소</h3>
              <p className="text-gray-600">타임스퀘어, 센트럴파크 등 세계적인 랜드마크 방문</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">문화 체험</h3>
              <p className="text-gray-600">브로드웨이 뮤지컬과 다양한 문화 공연 관람</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">포토 스팟</h3>
              <p className="text-gray-600">인스타그램 인기 촬영지와 숨겨진 명소 발견</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
