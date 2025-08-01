'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Home, Palmtree, Umbrella, Wifi, Users, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function DomesticPoolVillaPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const packagesPerPage = 12
  
  useEffect(() => {
    async function fetchData() {
      try {
        // 패키지 데이터와 히어로 이미지를 병렬로 가져오기
        const [poolVillaData, heroImageData] = await Promise.all([
          getPackagesByTypeAndRegion('domestic', 'pool-villa'),
          getHeroImage('domestic', 'pool-villa')
        ])
        
        console.log('풀빌라/펜션 패키지 조회 결과:', poolVillaData);
        console.log('국내 풀빌라/펜션 히어로 이미지:', heroImageData)
        
        setPackages(poolVillaData);
        setFilteredPackages(poolVillaData);
        setHeroImage(heroImageData)
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // 검색 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPackages(packages);
    } else {
      const filtered = packages.filter(pkg => 
        pkg.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPackages(filtered);
    }
    setCurrentPage(1); // 검색할 때 첫 페이지로 리셋
  }, [searchTerm, packages]);

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
  const backgroundImage = heroImage?.image_url || '/images/domestic-pool-villa-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(20, 184, 166, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'
  const title = heroImage?.title || '국내 풀빌라/펜션'
  const subtitle = heroImage?.subtitle || '프라이빗한 공간에서 즐기는 럭셔리한 휴식'

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
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
                제주도, 강원도, 경기도
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 flex-shrink-0" />
                프라이빗 풀장
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 검색 섹션 */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="풀빌라/펜션 검색..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600 text-center">
                총 {filteredPackages.length}개의 패키지를 찾았습니다.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 풀빌라/펜션</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              완벽한 프라이버시와 고급스러운 휴식을 제공하는 국내 최고의 풀빌라/펜션와 아늑한 펜션
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {packages.length > 0 ? (
              currentPackages.map((packageItem) => (
                <div 
                  key={packageItem.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col h-full flex flex-col h-full flex flex-col h-full flex flex-col"
                  onClick={() => router.push(`/package/${packageItem.id}`)}
                >
                  <div className="relative h-48 flex-shrink-0">
                    {packageItem.image ? (
                      <img 
                        src={packageItem.image} 
                        alt={packageItem.title || packageItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-teal-400 to-emerald-500 flex items-center justify-center">
                        <span className="text-white font-semibold">{packageItem.title || packageItem.name}</span>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      풀빌라/펜션
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{
                        (typeof packageItem.features === 'object' && !Array.isArray(packageItem.features) && packageItem.features?.location) || 
                        packageItem.location || 
                        packageItem.regionKo || 
                        packageItem.region_ko ||
                        '위치 정보 없음'
                      }</span>
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '프라이빗한 공간에서 즐기는 럭셔리한 휴식을 경험하세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Home className="w-4 h-4 flex-shrink-0" />
                        <span>독채</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>최대 6인</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-gray-500 text-sm block">/{packageItem.duration || '1박'}</span>
                      </div>
                      <div className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex-shrink-0">
                        예약하기
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">등록된 풀빌라/펜션 패키지가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">관리자가 곧 새로운 패키지를 추가할 예정입니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {packages.length > packagesPerPage && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                이전
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-teal-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center px-3 py-2 rounded-lg ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                다음
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 풀빌라/펜션 특징 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">풀빌라/펜션 특징</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">프라이빗 공간</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                독립된 공간에서 방해받지 않는 완벽한 프라이버시
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Umbrella className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">전용 수영장</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                계절에 관계없이 즐길 수 있는 개인 전용 풀
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">스마트 시설</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                최신 스마트홈 시스템과 고급 엔터테인먼트 시설
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">맞춤형 서비스</h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                셰프, 버틀러 등 요청 시 이용 가능한 특별 서비스
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
