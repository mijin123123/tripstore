'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Sun, Waves, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function GuamPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const heroImg = await getHeroImage('overseas', 'guam');
        console.log('괌 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);
      } catch (error) {
        console.error('괌 히어로 이미지 로딩 오류:', error);
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
      title: '괌 힐튼 리조트 4일',
      price: '1,290,000',
      duration: '4일 2박',
      rating: 4.7,
      image: '/images/guam-resort.jpg',
      highlights: ['투몬 비치', '언더워터 월드', '쇼핑', '차모로 빌리지'],
      departure: '매일 출발'
    },
    {
      id: 2,
      title: '괌 퍼시픽 아일랜드 클럽 4일',
      price: '1,190,000',
      duration: '4일 2박',
      rating: 4.5,
      image: '/images/guam-pic.jpg',
      highlights: ['키즈클럽', '워터파크', '가족여행', '액티비티'],
      departure: '매일 출발'
    },
    {
      id: 3,
      title: '괌 리프 호텔 자유여행 5일',
      price: '1,390,000',
      duration: '5일 3박',
      rating: 4.6,
      image: '/images/guam-reef.jpg',
      highlights: ['자유여행', '렌터카', '골프', '스노클링'],
      departure: '매일 출발'
    },
    {
      id: 4,
      title: '괌 두짓타니 럭셔리 4일',
      price: '1,890,000',
      duration: '4일 2박',
      rating: 4.8,
      image: '/images/guam-dusit.jpg',
      highlights: ['럭셔리 리조트', '스파', '프리미엄', '오션뷰'],
      departure: '매일 출발'
    },
    {
      id: 5,
      title: '괌 허니문 패키지 5일',
      price: '1,690,000',
      duration: '5일 3박',
      rating: 4.7,
      image: '/images/guam-honeymoon.jpg',
      highlights: ['허니문', '로맨틱', '선셋크루즈', '커플마사지'],
      departure: '매일 출발'
    },
    {
      id: 6,
      title: '괌 골프 패키지 4일',
      price: '1,590,000',
      duration: '4일 2박',
      rating: 4.5,
      image: '/images/guam-golf.jpg',
      highlights: ['골프 2라운드', '골프장 픽업', '캐디피', '남성 추천'],
      departure: '매일 출발'
    }
  ];

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/guam-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)'
  const title = heroImage?.title || '괌'
  const subtitle = heroImage?.subtitle || '가까운 해외, 완벽한 휴양지'

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
                태평양의 진주
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                직항 3시간 30분
              </span>
              <span className="flex items-center gap-1">
                <Sun className="w-4 h-4" />
                연중 따뜻한 날씨
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">괌 여행 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              3시간 30분 만에 도착하는 가까운 해외여행지, 괌에서 완벽한 휴식을 만나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48 flex-shrink-0 flex-shrink-0">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center justify-center">
                    <span className="text-white font-semibold text-center px-4">{pkg.title}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate font-semibold">{pkg.rating}</span>
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
                        <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₩{pkg.price}</span>
                      <span className="text-gray-500 text-sm">/인</span>
                    </div>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">괌 여행 정보</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">항공편</h3>
              <p className="text-gray-600">
                인천공항에서 직항 3시간 30분<br/>
                비자 없이 45일 체류 가능
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">날씨</h3>
              <p className="text-gray-600">
                연중 26-28도의 따뜻한 날씨<br/>
                우기(7-11월), 건기(12-6월)
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">액티비티</h3>
              <p className="text-gray-600">
                스노클링, 다이빙, 제트스키<br/>
                골프, 쇼핑, 차모로 문화체험
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
