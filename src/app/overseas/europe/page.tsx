'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPackagesByTypeAndRegion } from '@/lib/api'
import { Package } from '@/types'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function EuropePage() {
  const router = useRouter();
  const [europePackages, setEuropePackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  
  // 숫자를 천 단위 콤마 형식으로 변환하는 함수
  const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseInt(price) || 0 : price
    return numPrice.toLocaleString('ko-KR')
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('유럽 페이지: 데이터 조회 시작');
        
        // 패키지 데이터와 히어로 이미지를 병렬로 가져오기
        const [packages, heroImg] = await Promise.all([
          getPackagesByTypeAndRegion('overseas', 'europe'),
          getHeroImage('overseas', 'europe')
        ]);
        
        console.log('유럽 페이지: 조회된 패키지 개수:', packages.length);
        console.log('유럽 페이지: 히어로 이미지:', heroImg);
        setEuropePackages(packages);
        setHeroImage(heroImg);
      } catch (error) {
        console.error('유럽 패키지를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
  // 패키지 데이터에 추가할 패키지들 (백업/데모 데이터)
  const additionalPackages = [
    {
      id: 'europe-4',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽',
      title: '스페인 & 포르투갈 9일',
      price: '3,790,000',
      duration: '9일 7박',
      rating: 4.6,
      image: '/images/europe-spain.jpg',
      highlights: ['사그라다 파밀리아', '알함브라 궁전', '포르투', '리스본'],
      departure: '매주 화/일 출발',
      description: '열정의 나라 스페인과 아름다운 포르투갈의 매력을 느낄 수 있는 9일 여행입니다.'
    },
    {
      id: 'europe-5',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽',
      title: '그리스 아테네 & 산토리니 7일',
      price: '3,290,000',
      duration: '7일 5박',
      rating: 4.5,
      image: '/images/europe-greece.jpg',
      highlights: ['아크로폴리스', '산토리니 일몰', '아테네 플라카', '이아 마을'],
      departure: '매주 월/금 출발',
      description: '신화와 역사의 나라 그리스와 환상적인 에게해의 보석 산토리니를 방문하는 7일 여행입니다.'
    }
  ];
  
  // 모든 패키지 병합 (실제 데이터베이스 패키지를 우선하고, 데이터가 없으면 데모 데이터 표시)
  const packages = europePackages.length > 0 ? europePackages : additionalPackages;

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/europe-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(30, 58, 138, 0.3) 100%)'
  const title = heroImage?.title || '유럽'
  const subtitle = heroImage?.subtitle || '유럽의 아름다운 도시들과 역사적인 명소를 탐험하세요'

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
                파리, 런던, 로마, 바르셀로나
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4 flex-shrink-0" />
                직항 8-10시간
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 유럽 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              유럽의 아름다운 도시와 문화 명소를 방문하는 특별한 여행 패키지
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPackages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col" onClick={() => router.push(`/package/${pkg.id}`)}>
                {/* 이미지 섹션 */}
                <div className="relative h-48 flex-shrink-0">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">유럽</span>
                  </div>
                  
                  {/* 여행 정보 */}
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {(pkg.highlights || []).slice(0, 2).map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Plane className="w-4 h-4 flex-shrink-0" />
                      <span>{pkg.departure}</span>
                    </div>
                  </div>
                  
                  {/* 가격 및 예약 */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{formatPrice(pkg.price)}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
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

          {/* 여행 팁 섹션 */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">유럽 여행 팁</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">최적 시기</h3>
                <p className="text-gray-600 text-sm line-clamp-3">4-6월, 9-10월이 날씨가 좋고 관광하기 적합</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">교통</h3>
                <p className="text-gray-600 text-sm line-clamp-3">유럽 패스 활용하여 편리한 기차 여행</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">언어</h3>
                <p className="text-gray-600 text-sm line-clamp-3">영어로 대부분 소통 가능, 기본 현지어 학습 권장</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">팁</h3>
                <p className="text-gray-600 text-sm line-clamp-3">박물관 패스 구매로 시간과 비용 절약</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
