'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Building, ShoppingBag, Crown, Mountain, Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'
import { getAllPackages } from '@/lib/api'
import { Package } from '@/types'

export default function TaiwanHongkongMacauPage() {
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
        const heroImg = await getHeroImage('overseas', 'taiwan-hongkong-macau');
        console.log('대만/홍콩/마카오 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);

        // 대만/홍콩/마카오 패키지 가져오기
        const allPackages = await getAllPackages();
        const taiwanPackages = allPackages.filter(pkg => 
          pkg.category === 'overseas' && 
          (pkg.region === 'taiwan-hongkong-macau' || pkg.regionKo === '대만/홍콩/마카오')
        );
        console.log('대만/홍콩/마카오 패키지:', taiwanPackages);
        setPackages(taiwanPackages);
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
  const backgroundImage = heroImage?.image_url || '/images/taiwan-hongkong-macau-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(16, 185, 129, 0.3) 100%)'
  const title = heroImage?.title || '대만/홍콩/마카오'
  const subtitle = heroImage?.subtitle || '가까운 아시아의 다채로운 문화와 매력'

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
                대만, 홍콩, 마카오
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4 flex-shrink-0" />
                직항 2.5-3.5시간
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 대만·홍콩·마카오 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              각기 다른 매력을 가진 아시아의 보석 같은 여행지들
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
              <p className="text-gray-600 text-lg mb-2">대만·홍콩·마카오 여행 패키지가 준비 중입니다.</p>
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
                      <span className="text-sm truncate">{pkg.regionKo || pkg.region || '대만/홍콩/마카오'}</span>
                    </div>
                    
                    {/* 여행 정보 */}
                    <div className="mb-4 flex-grow">
                      <div className="flex flex-wrap gap-2">
                        {pkg.highlights?.slice(0, 2).map((highlight, index) => (
                          <span 
                            key={index}
                            className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full"
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
                        <div className="text-lg font-bold text-red-600">
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
                    <span className="text-sm truncate">대만/홍콩/마카오</span>
                  </div>
                  
                  {/* 여행 정보 */}
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights?.slice(0, 2).map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-gradient-to-r from-red-50 via-purple-50 to-emerald-50 text-purple-600 text-xs px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Plane className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{pkg.departure}</span>
                    </div>
                  </div>
                  
                  {/* 가격 및 예약 */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-purple-600 line-clamp-2">{pkg.price}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors flex-shrink-0"
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
                        ? 'bg-purple-600 text-white'
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
            <h2 className="text-2xl font-bold mb-6 text-center">대만·홍콩·마카오 여행 가이드</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* 대만 정보 */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-emerald-600 flex items-center gap-2 line-clamp-2">
                  <Mountain className="w-5 h-5" />
                  대만
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 무비자 30일 체류</li>
                  <li>• 타이베이 101, 야시장</li>
                  <li>• 타로코 협곡, 일월담</li>
                  <li>• 신타이완달러 (TWD)</li>
                </ul>
              </div>

              {/* 홍콩 정보 */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2 line-clamp-2">
                  <Building className="w-5 h-5" />
                  홍콩
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 무비자 90일 체류</li>
                  <li>• 빅토리아 하버, 디즈니랜드</li>
                  <li>• 센트럴, 침사추이</li>
                  <li>• 홍콩달러 (HKD)</li>
                </ul>
              </div>

              {/* 마카오 정보 */}
              <div className="border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-600 flex items-center gap-2 line-clamp-2">
                  <Crown className="w-5 h-5" />
                  마카오
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 무비자 30일 체류</li>
                  <li>• 베네치안, 갤럭시 카지노</li>
                  <li>• 성 바울 성당 유적</li>
                  <li>• 마카오파타카 (MOP)</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-bold mb-3 text-blue-600">여행 팁</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 여권 유효기간 6개월 이상</li>
                  <li>• 왕복 항공권 준비</li>
                  <li>• 현지 심카드/와이파이</li>
                  <li>• 옥토퍼스 카드 (홍콩)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-green-600">쇼핑</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• DFS 면세점</li>
                  <li>• 하버시티 몰</li>
                  <li>• 시먼딩 쇼핑가</li>
                  <li>• 로컬 야시장</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-purple-600">음식</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 딤섬, 차찬탱</li>
                  <li>• 타이완 야시장 음식</li>
                  <li>• 포르투갈 요리</li>
                  <li>• 에그타르트</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3 text-orange-600">교통</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 홍콩-마카오: 페리 1시간</li>
                  <li>• 지하철(MTR) 이용</li>
                  <li>• 택시, 버스</li>
                  <li>• 투어버스 추천</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
