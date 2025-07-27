'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Sun, Waves, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'
import { getAllPackages } from '@/lib/api'
import { Package } from '@/types'

export default function GuamSaipanPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      try {
        // 히어로 이미지 가져오기
        const heroImg = await getHeroImage('overseas', 'guam-saipan');
        console.log('괌/사이판 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);

        // 괌/사이판 패키지 가져오기
        const allPackages = await getAllPackages();
        const guamPackages = allPackages.filter(pkg => 
          pkg.category === 'overseas' && 
          (pkg.region === 'guam-saipan' || pkg.regionKo === '괌/사이판')
        );
        console.log('괌/사이판 패키지:', guamPackages);
        setPackages(guamPackages);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 데이터베이스에서 패키지를 가져오는 로직을 추가하거나 빈 배열로 초기화
  // const packages: any[] = [];

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
  const backgroundImage = heroImage?.image_url || '/images/guam-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(2, 132, 199, 0.3) 100%)'
  const title = heroImage?.title || '괌/사이판'
  const subtitle = heroImage?.subtitle || '가까운 태평양 휴양지에서 즐기는 완벽한 휴식'

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
                괌, 사이판, 로타, 티니안
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4 flex-shrink-0" />
                직항 3.5시간
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 괌·사이판 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              짧은 비행시간으로 만나는 환상적인 남태평양의 휴양지
            </p>
          </div>
          
          {isLoading ? (
            // 로딩 상태
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden h-96">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-6">
                      <div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
                      <div className="bg-gray-200 h-4 w-1/2 mb-4 rounded"></div>
                      <div className="flex justify-between">
                        <div className="bg-gray-200 h-8 w-20 rounded"></div>
                        <div className="bg-gray-200 h-8 w-16 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : packages.length === 0 ? (
            // 패키지 없음
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-2">괌·사이판 여행 패키지가 준비 중입니다.</p>
              <p className="text-gray-500">관리자 페이지에서 패키지를 추가해주세요.</p>
            </div>
          ) : (
            // 패키지 목록
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => router.push(`/package/${pkg.id}`)}
                >
                  {/* 이미지 섹션 */}
                  <div className="relative h-48 flex-shrink-0">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{pkg.rating || 5}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{pkg.regionKo || pkg.region || '괌/사이판'}</span>
                    </div>
                    
                    {/* 여행 정보 */}
                    <div className="mb-4 flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {pkg.highlights?.slice(0, 2).map((highlight, index) => (
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
                        <span className="text-sm">{pkg.duration || '준비중'}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {(typeof pkg.price === 'string' ? parseInt(pkg.price) : pkg.price).toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-500">1인 기준</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">괌·사이판</span>
                  </div>
                  
                  {/* 여행 정보 */}
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 2).map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-cyan-50 text-cyan-600 text-xs px-2 py-1 rounded-full"
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
                        <span className="text-xl font-bold text-gray-900 line-clamp-2">{pkg.price}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-cyan-700 transition-colors flex-shrink-0"
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

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg ${
                      page === currentPage
                        ? 'bg-cyan-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">괌·사이판 여행 가이드</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-3 text-blue-600">입국 정보</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 무비자 45일 체류</li>
                  <li>• 여권 유효기간 6개월</li>
                  <li>• ESTA 사전 신청 (괌)</li>
                  <li>• 왕복 항공권 필수</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-green-600">추천 활동</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 스노클링/다이빙</li>
                  <li>• 패러세일링</li>
                  <li>• 돌핀 워칭</li>
                  <li>• 선셋 크루즈</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-purple-600">쇼핑</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• DFS 면세점</li>
                  <li>• 아울렛 쇼핑</li>
                  <li>• 현지 기념품</li>
                  <li>• 화장품/향수</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-orange-600">음식</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 차모로 요리</li>
                  <li>• 코코넛 크랩</li>
                  <li>• BBQ 레스토랑</li>
                  <li>• 트로피컬 과일</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
