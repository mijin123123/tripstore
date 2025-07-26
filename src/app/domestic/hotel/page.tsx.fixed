'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Bed, Coffee, Car, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

// 패키지 타입 정의
interface Package {
  id: number
  title: string
  name?: string
  description: string
  price: number
  image: string
  location?: string
  region?: string
  type?: string
}

// 히어로 이미지 타입 정의
interface HeroImage {
  id: number
  category: string
  region: string
  image_url: string
  title: string
  description: string
}

// 패키지 데이터 가져오기 함수
async function getPackagesByTypeAndRegion(type: string, region: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('type', type)
    .eq('region', region)
  
  if (error) {
    console.error('패키지 조회 오류:', error)
    return []
  }
  
  return data || []
}

// 히어로 이미지 가져오기 함수
async function getHeroImage(category: string, region: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .eq('category', category)
    .eq('region', region)
    .single()
  
  if (error) {
    console.error('히어로 이미지 조회 오류:', error)
    return null
  }
  
  return data
}

export default function DomesticHotelPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const packagesPerPage = 12
  
  useEffect(() => {
    async function fetchData() {
      try {
        // 패키지 데이터와 히어로 이미지를 병렬로 가져오기
        const [hotelData, heroImageData] = await Promise.all([
          getPackagesByTypeAndRegion('domestic', 'hotel'),
          getHeroImage('domestic', 'hotel')
        ])
        
        console.log('국내 호텔 패키지 조회 결과:', hotelData);
        console.log('국내 호텔 히어로 이미지:', heroImageData)
        
        setPackages(hotelData);
        setHeroImage(heroImageData)
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 페이지네이션 계산
  const indexOfLastPackage = currentPage * packagesPerPage
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage
  const currentPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage)
  const totalPages = Math.ceil(packages.length / packagesPerPage)

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero 섹션 */}
      <div className="relative h-80 overflow-hidden">
        {heroImage?.image_url ? (
          <img 
            src={heroImage.image_url} 
            alt={heroImage.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              {heroImage?.title || '추천 국내 호텔/리조트'}
            </h1>
            <p className="text-xl opacity-90">
              {heroImage?.description || '전국 각지의 프리미엄 호텔과 리조트에서 편안하고 특별한 휴식을 만끽하세요'}
            </p>
          </div>
        </div>
      </div>

      {/* 패키지 목록 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 국내 호텔/리조트</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              전국 각지의 프리미엄 호텔과 리조트에서 편안하고 특별한 휴식을 만끽하세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : packages.length > 0 ? (
              currentPackages.map((packageItem) => (
                <div 
                  key={packageItem.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
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
                      <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center">
                        <span className="text-white font-semibold">{packageItem.title || packageItem.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm truncate">{packageItem.location || '위치 정보 없음'}</span>
                    </div>
                    
                    <div className="mb-4 flex-grow">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '편안하고 고급스러운 호텔에서의 특별한 휴식을 즐기세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold text-gray-900">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-sm text-gray-500">/1박</span>
                      </div>
                      <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">
                        상세보기
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600">등록된 호텔 패키지가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
