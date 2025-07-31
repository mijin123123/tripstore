'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Thermometer, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'
import { getAllPackages } from '@/lib/api'
import { Package } from '@/types'

export default function SoutheastAsiaPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;

  useEffect(() => {
    async function fetchData() {
      try {
        // 히어로 이미지 가져오기
        const heroImg = await getHeroImage('overseas', 'southeast-asia');
        console.log('동남아시아 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);

        // 동남아 패키지 가져오기
        const allPackages = await getAllPackages();
        const southeastAsiaPackages = allPackages.filter(pkg => 
          pkg.type === 'overseas' && 
          (pkg.region === 'southeast-asia' || pkg.regionKo === '동남아')
        );
        console.log('동남아시아 패키지:', southeastAsiaPackages);
        setPackages(southeastAsiaPackages);
        setFilteredPackages(southeastAsiaPackages);
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 검색 기능
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg =>
        (pkg.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pkg.highlights && pkg.highlights.some(highlight => 
          highlight.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredPackages(filtered);
    }
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  }, [searchTerm, packages]);

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 데이터베이스에서 패키지를 가져오는 로직을 추가하거나 빈 배열로 초기화
  // const packages: any[] = [];

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPackages.length / packagesPerPage)
  const startIndex = (currentPage - 1) * packagesPerPage
  const endIndex = startIndex + packagesPerPage
  const currentPackages = filteredPackages.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=7680&q=100&dpr=2'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(5, 150, 105, 0.3) 0%, rgba(4, 120, 87, 0.3) 100%)'
  const title = heroImage?.title || '동남아시아'
  const subtitle = heroImage?.subtitle || '열대의 낙원에서 즐기는 완벽한 휴양과 모험'

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
                태국, 베트남, 필리핀, 싱가포르
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4 flex-shrink-0" />
                직항 3-7시간
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 검색 섹션 */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="패키지명, 설명, 특징으로 검색하세요... (예: 방콕, 푸켓, 호치민)"
                value={searchTerm}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            {searchTerm && (
              <div className="mt-2 text-sm text-gray-600 text-center">
                "{searchTerm}"에 대한 검색 결과: {filteredPackages.length}개
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 동남아시아 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              열대 휴양지에서의 완벽한 휴식과 이국적인 문화 체험
            </p>
          </div>
          
          {isLoading ? (
            // 로딩 상태
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden h-96">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-6 flex flex-col flex-grow">
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
          ) : filteredPackages.length === 0 ? (
            // 패키지 없음 또는 검색 결과 없음
            <div className="text-center py-12">
              {searchTerm ? (
                <>
                  <p className="text-gray-600 text-lg mb-2">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
                  <p className="text-gray-500">다른 검색어를 시도해보세요.</p>
                </>
              ) : (
                <>
                  <p className="text-gray-600 text-lg mb-2">동남아시아 여행 패키지가 준비 중입니다.</p>
                  <p className="text-gray-500">관리자 페이지에서 패키지를 추가해주세요.</p>
                </>
              )}
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
                      src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : '/images/southeast-asia-hero.jpg'} 
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm truncate">{pkg.rating || 5}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      인기
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{pkg.title}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{pkg.regionKo || pkg.region || '동남아시아'}</span>
                    </div>
                    
                    {/* 여행 정보 */}
                    <div className="mb-4 flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {pkg.highlights?.slice(0, 2).map((highlight, index) => (
                          <span 
                            key={index}
                            className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">{pkg.duration || '준비중'}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
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
          
          {/* 페이지네이션 */}
          {!isLoading && packages.length > packagesPerPage && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        currentPage === page
                          ? 'bg-green-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 동남아 여행 정보 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 여행 팁 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">동남아 여행 팁</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Thermometer className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">날씨</h3>
                    <p className="text-gray-600 text-sm">연중 고온다습, 우기(5-10월) 피하는 것이 좋음</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">비자</h3>
                    <p className="text-gray-600 text-sm">대부분 무비자 또는 도착비자 가능</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">언어</h3>
                    <p className="text-gray-600 text-sm">영어 소통 가능, 간단한 현지어 학습 권장</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 추천 활동 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">추천 활동</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">🏖️ 해양 스포츠</h3>
                  <p className="text-blue-600 text-sm">스노클링, 다이빙, 서핑 등 다양한 해양 활동</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-700 mb-2">🍜 현지 음식</h3>
                  <p className="text-green-600 text-sm">팟타이, 쌀국수, 똠얌꿍 등 현지 요리 체험</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-700 mb-2">🏛️ 문화 체험</h3>
                  <p className="text-purple-600 text-sm">사원 방문, 전통 마사지, 현지 시장 구경</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
