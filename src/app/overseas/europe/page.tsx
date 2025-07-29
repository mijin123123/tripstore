'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getPackagesByTypeAndRegion } from '@/lib/api'
import { Package } from '@/types'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function EuropePage() {
  const router = useRouter();
  const [europePackages, setEuropePackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 12;
  
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
        setFilteredPackages(packages);
        setHeroImage(heroImg);
      } catch (error) {
        console.error('유럽 패키지를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 검색 기능
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPackages(europePackages);
    } else {
      const filtered = europePackages.filter(pkg =>
        (pkg.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pkg.highlights && pkg.highlights.some(highlight => 
          highlight.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredPackages(filtered);
    }
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  }, [searchTerm, europePackages]);

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
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
  const backgroundImage = heroImage?.image_url || 'https://images.unsplash.com/photo-1520986606214-8b456906c813?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=7680&q=100&dpr=2'
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
                placeholder="패키지명, 설명, 특징으로 검색하세요... (예: 파리, 런던, 로마)"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 유럽 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              유럽의 아름다운 도시와 문화 명소를 방문하는 특별한 여행 패키지
            </p>
          </div>
          
          {currentPackages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm 
                  ? `"${searchTerm}"에 대한 검색 결과가 없습니다.` 
                  : '현재 등록된 유럽 여행 패키지가 없습니다.'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col h-full flex flex-col" onClick={() => router.push(`/package/${pkg.id}`)}>
                  {/* 이미지 섹션 */}
                  <div className="relative h-48 flex-shrink-0">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                    
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      유럽
                    </div>
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
                        <span className="text-lg font-bold text-gray-900 line-clamp-2">{formatPrice(pkg.price)}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex-shrink-0"
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
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 유럽 여행 특징 섹션 */}
      <section className="py-16 bg-gray-50"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
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
