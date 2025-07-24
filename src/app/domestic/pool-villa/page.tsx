'use client'

import { useState, useEffect } from 'react'
import { MapPin, Star, Calendar, Home, Palmtree, Umbrella, Wifi, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'

export default function DomesticPoolVillaPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchPoolVillas() {
      try {
        console.log('풀빌라 패키지 조회 시작: type=domestic, region=pool-villa');
        const poolVillaData = await getPackagesByTypeAndRegion('domestic', 'pool-villa');
        console.log('풀빌라 패키지 조회 결과:', poolVillaData);
        setPackages(poolVillaData);
      } catch (error) {
        console.error('풀빌라 패키지 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPoolVillas();
  }, []);

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
      <section className="relative h-96 bg-gradient-to-r from-teal-500 to-emerald-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">국내 풀빌라</h1>
            <p className="text-xl mb-6">프라이빗한 공간에서 즐기는 럭셔리한 휴식</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                제주도, 강원도, 경기도
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                프라이빗 풀장
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 풀빌라</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              완벽한 프라이버시와 고급스러운 휴식을 제공하는 국내 최고의 풀빌라
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.length > 0 ? (
              packages.map((packageItem) => (
                <div 
                  key={packageItem.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => router.push(`/package/${packageItem.id}`)}
                >
                  <div className="relative h-48">
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
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">5</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      풀빌라
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{
                        (typeof packageItem.features === 'object' && !Array.isArray(packageItem.features) && packageItem.features?.location) || 
                        packageItem.location || 
                        '제주도'
                      }</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '프라이빗한 공간에서 즐기는 럭셔리한 휴식을 경험하세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Home className="w-4 h-4" />
                        <span>독채</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>최대 6인</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-teal-600">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-gray-500 text-sm block">/{packageItem.duration || '1박'}</span>
                      </div>
                      <div className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                        예약하기
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">등록된 풀빌라 패키지가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">관리자가 곧 새로운 패키지를 추가할 예정입니다.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 풀빌라 특징 */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">풀빌라 특징</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">프라이빗 공간</h3>
              <p className="text-gray-600 text-sm">
                독립된 공간에서 방해받지 않는 완벽한 프라이버시
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Umbrella className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">전용 수영장</h3>
              <p className="text-gray-600 text-sm">
                계절에 관계없이 즐길 수 있는 개인 전용 풀
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">스마트 시설</h3>
              <p className="text-gray-600 text-sm">
                최신 스마트홈 시스템과 고급 엔터테인먼트 시설
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="font-bold mb-2">맞춤형 서비스</h3>
              <p className="text-gray-600 text-sm">
                셰프, 버틀러 등 요청 시 이용 가능한 특별 서비스
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
