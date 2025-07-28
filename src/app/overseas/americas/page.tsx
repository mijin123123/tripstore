'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Thermometer, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'
import { getAllPackages } from '@/lib/api'
import { Package } from '@/types'

export default function AmericasPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      try {
        // 히어로 이미지 가져오기
        const heroImg = await getHeroImage('overseas', 'americas');
        console.log('미주 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);

        // 미주 패키지 가져오기
        const allPackages = await getAllPackages();
        const americasPackages = allPackages.filter(pkg => 
          pkg.category === 'overseas' && 
          (pkg.region === 'americas' || pkg.regionKo === '미주' || pkg.regionKo === '미국' || pkg.regionKo === '캐나다')
        );
        console.log('미주 패키지:', americasPackages);
        setPackages(americasPackages);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 페이지네이션 계산
  const totalPages = Math.ceil(packages.length / packagesPerPage)
  const startIndex = (currentPage - 1) * packagesPerPage
  const endIndex = startIndex + packagesPerPage
  const currentPackages = packages.slice(startIndex, endIndex)

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80"></div>
        {heroImage && (
          <img 
            src={heroImage.url} 
            alt={heroImage.alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">미주</h1>
            <p className="text-xl md:text-2xl mb-8">미국과 캐나다의 웅장한 자연과 도시의 매력</p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center">
                <Thermometer className="w-5 h-5 mr-2" />
                <span>사계절 여행</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>10-15시간 비행</span>
              </div>
              <div className="flex items-center">
                <Plane className="w-5 h-5 mr-2" />
                <span>직항 가능</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 메인 컨텐츠 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">미주 여행 패키지</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              광활한 대자연과 현대 문명이 조화를 이룬 북미 대륙에서 특별한 경험을 만나보세요.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              총 {packages.length}개의 패키지
            </div>
          </div>

          {packages.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🗽</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                현재 등록된 미주 패키지가 없습니다
              </h3>
              <p className="text-gray-500 mb-8">
                새로운 패키지가 곧 추가될 예정입니다.
              </p>
              <button 
                onClick={() => router.push('/overseas')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                다른 해외여행 보기
              </button>
            </div>
          ) : (
            <>
              {/* 패키지 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {currentPackages.map((pkg, index) => (
                  <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={pkg.images?.[0] || '/api/placeholder/400/300'} 
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {pkg.duration}
                      </div>
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                      
                      <div className="space-y-2 mb-4">
                        {pkg.highlights?.slice(0, 2).map((highlight, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                            <span className="line-clamp-1">{highlight}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{pkg.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{pkg.departure}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-right">
                          <span className="text-xl font-bold text-gray-900 line-clamp-2">{pkg.price}원</span>
                          <div className="text-sm text-gray-500">1인 기준</div>
                        </div>
                        <button 
                          onClick={() => {
                            router.push(`/package/${pkg.id}`);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          자세히 보기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
