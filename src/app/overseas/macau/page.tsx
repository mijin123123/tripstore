'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Building, Crown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function MacauPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const heroImg = await getHeroImage('overseas', 'macau');
        console.log('마카오 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);
      } catch (error) {
        console.error('마카오 히어로 이미지 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHeroImage();
  }, []);


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
      id: 1,
      title: '마카오 베네치안 리조트 3일',
      price: '990,000',
      duration: '3일 2박',
      rating: 4.7,
      image: '/images/macau-venetian.jpg',
      highlights: ['베네치안 리조트', '카지노', '쇼핑몰', '곤돌라'],
      departure: '매일 출발'
    },
    {
      id: 2,
      title: '마카오 시티 오브 드림스 4일',
      price: '1,190,000',
      duration: '4일 2박',
      rating: 4.6,
      image: '/images/macau-cod.jpg',
      highlights: ['시티오브드림스', '하드락호텔', '쇼', '카지노'],
      departure: '매일 출발'
    },
    {
      id: 3,
      title: '마카오 월드유산 투어 3일',
      price: '790,000',
      duration: '3일 2박',
      rating: 4.5,
      image: '/images/macau-heritage.jpg',
      highlights: ['세나두 광장', '성 바울 성당', '마카오 타워', '문화투어'],
      departure: '매일 출발'
    },
    {
      id: 4,
      title: '마카오 미식 투어 4일',
      price: '890,000',
      duration: '4일 2박',
      rating: 4.8,
      image: '/images/macau-food.jpg',
      highlights: ['포르투갈 요리', '에그타르트', '미슐랭 맛집', '로컬푸드'],
      departure: '매일 출발'
    },
    {
      id: 5,
      title: '마카오 럭셔리 갤럭시 5일',
      price: '1,590,000',
      duration: '5일 3박',
      rating: 4.9,
      image: '/images/macau-galaxy.jpg',
      highlights: ['갤럭시 마카오', '리츠칼튼', 'JW메리어트', '럭셔리'],
      departure: '매일 출발'
    },
    {
      id: 6,
      title: '마카오 쇼 관람 패키지 3일',
      price: '1,090,000',
      duration: '3일 2박',
      rating: 4.6,
      image: '/images/macau-show.jpg',
      highlights: ['하우스 오브 댄싱 워터', '더 골든 마스크', '쇼 관람', '엔터테인먼트'],
      departure: '매일 출발'
    }
  ];

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/macau-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.3) 100%)'
  const title = heroImage?.title || '마카오'
  const subtitle = heroImage?.subtitle || '동양의 라스베가스, 포르투갈 문화유산'

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{title}</h1>
            <p className="text-xl mb-6 drop-shadow-md">{subtitle}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                유네스코 세계문화유산
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                홍콩에서 페리 1시간
              </span>
              <span className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                카지노와 엔터테인먼트
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">마카오 여행 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              포르투갈 문화와 중국 전통이 만나는 마카오에서 특별한 경험을 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-center px-4">{pkg.title}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{pkg.departure}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight, index) => (
                        <span key={index} className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-purple-600">₩{pkg.price}</span>
                      <span className="text-gray-500 text-sm">/인</span>
                    </div>
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => router.push(`/package/${pkg.id}`)}
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

      {/* Info Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">마카오 여행 정보</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">교통편</h3>
              <p className="text-gray-600">
                홍콩에서 페리로 1시간<br/>
                인천공항에서 직항 3시간 30분
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">카지노</h3>
              <p className="text-gray-600">
                베네치안, 갤럭시, 윈<br/>
                세계 최대 규모의 카지노들
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">문화유산</h3>
              <p className="text-gray-600">
                성 바울 성당, 세나두 광장<br/>
                포르투갈 식민지 건축물
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
