'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Sun, Waves, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function SaipanPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const heroImg = await getHeroImage('overseas', 'saipan');
        console.log('사이판 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);
      } catch (error) {
        console.error('사이판 히어로 이미지 로딩 오류:', error);
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
      title: '사이판 하얏트 리조트 5일',
      price: '1,490,000',
      duration: '5일 3박',
      rating: 4.6,
      image: '/images/saipan-resort.jpg',
      highlights: ['마나가하섬', '그로토', '만세절벽', '골프'],
      departure: '매일 출발'
    },
    {
      id: 2,
      title: '사이판 월드 리조트 4일',
      price: '1,290,000',
      duration: '4일 2박',
      rating: 4.5,
      image: '/images/saipan-world.jpg',
      highlights: ['워터파크', '키즈클럽', '가족여행', '수상스포츠'],
      departure: '매일 출발'
    },
    {
      id: 3,
      title: '사이판 아쿠아 리조트 자유여행 5일',
      price: '1,390,000',
      duration: '5일 3박',
      rating: 4.7,
      image: '/images/saipan-aqua.jpg',
      highlights: ['자유여행', '렌터카', '다이빙', '스노클링'],
      departure: '매일 출발'
    },
    {
      id: 4,
      title: '사이판 럭셔리 허니문 5일',
      price: '1,890,000',
      duration: '5일 3박',
      rating: 4.8,
      image: '/images/saipan-honeymoon.jpg',
      highlights: ['허니문', '로맨틱', '선셋크루즈', '커플스파'],
      departure: '매일 출발'
    },
    {
      id: 5,
      title: '사이판 역사탐방 패키지 4일',
      price: '1,190,000',
      duration: '4일 2박',
      rating: 4.4,
      image: '/images/saipan-history.jpg',
      highlights: ['역사탐방', '문화체험', '만세절벽', '수이사이드클리프'],
      departure: '매일 출발'
    },
    {
      id: 6,
      title: '사이판 골프 패키지 5일',
      price: '1,690,000',
      duration: '5일 3박',
      rating: 4.6,
      image: '/images/saipan-golf.jpg',
      highlights: ['골프 3라운드', '오션뷰 골프장', '캐디피', '골프용품'],
      departure: '매일 출발'
    }
  ];

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/saipan-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)'
  const title = heroImage?.title || '사이판'
  const subtitle = heroImage?.subtitle || '역사와 자연이 어우러진 아름다운 섬'

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
                <MapPin className="w-4 h-4 flex-shrink-0" />
                북마리아나 제도
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4 flex-shrink-0" />
                직항 3시간 30분
              </span>
              <span className="flex items-center gap-1">
                <Sun className="w-4 h-4 flex-shrink-0" />
                연중 따뜻한 열대기후
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">사이판 여행 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              아름다운 바다와 역사적 의미가 깊은 사이판에서 특별한 여행을 경험하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-center px-4">{pkg.title}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{pkg.departure}</span>
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
                  
                  <div className="flex items-center justify-between mt-auto">
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">사이판 여행 정보</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">항공편</h3>
              <p className="text-gray-600">
                인천공항에서 직항 3시간 30분<br/>
                비자 없이 45일 체류 가능
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">날씨</h3>
              <p className="text-gray-600">
                연중 26-28도의 열대성 기후<br/>
                우기(7-11월), 건기(12-6월)
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">명소</h3>
              <p className="text-gray-600">
                만세절벽, 그로토, 마나가하섬<br/>
                역사탐방, 다이빙, 골프
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
