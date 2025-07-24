'use client'

import { useState, useEffect } from 'react'
import { MapPin, Calendar, Users, Star, Clock, Plane, Cherry, Mountain } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Package } from '@/types'
import { getPackagesByTypeAndRegion } from '@/lib/api'

export default function JapanPage() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchJapanPackages() {
      try {
        console.log('일본 패키지 조회 시작: type=overseas, region=japan');
        const japanData = await getPackagesByTypeAndRegion('overseas', 'japan');
        console.log('일본 패키지 조회 결과:', japanData);
        setPackages(japanData);
      } catch (error) {
        console.error('일본 패키지 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchJapanPackages();
  }, []);

  const seasonInfo = {
    spring: { name: '봄 (3-5월)', desc: '벚꽃이 만개하는 가장 아름다운 시기', color: 'pink' },
    summer: { name: '여름 (6-8월)', desc: '축제와 불꽃놀이의 계절', color: 'green' },
    autumn: { name: '가을 (9-11월)', desc: '단풍이 아름다운 황금빛 계절', color: 'orange' },
    winter: { name: '겨울 (12-2월)', desc: '눈과 온천을 즐기는 낭만적인 시기', color: 'blue' }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-pink-600 to-red-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">일본</h1>
            <p className="text-xl mb-6">전통과 현대가 조화를 이루는 아름다운 일본을 경험하세요</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                도쿄, 오사카, 교토, 홋카이도
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                직항 2-3시간
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 일본 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              일본의 전통과 현대가 어우러진 매력적인 여행 패키지
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : packages.length > 0 ? (
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
                      <div className="w-full h-full bg-gradient-to-r from-pink-400 to-red-500 flex items-center justify-center">
                        <span className="text-white font-semibold">{packageItem.title || packageItem.name}</span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">5</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      일본여행
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{packageItem.title || packageItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{
                        (typeof packageItem.features === 'object' && !Array.isArray(packageItem.features) && packageItem.features?.location) || 
                        packageItem.location || 
                        '일본'
                      }</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {packageItem.description || '전통과 현대가 조화를 이루는 아름다운 일본을 경험하세요.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{packageItem.duration || '5일'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Plane className="w-4 h-4" />
                        <span>{packageItem.departure || '인천 출발'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-pink-600">
                          {Number(packageItem.price).toLocaleString()}원
                        </span>
                        <span className="text-gray-500 text-sm block">/{packageItem.duration || '패키지'}</span>
                      </div>
                      <div className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                        예약하기
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">등록된 일본 여행 패키지가 없습니다.</p>
                <p className="text-gray-400 text-sm mt-2">관리자가 곧 새로운 패키지를 추가할 예정입니다.</p>
              </div>
            )}
          </div>

          {/* 일본 여행 가이드 */}

          {/* 일본 여행 가이드 */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 여행 준비사항 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-pink-600">여행 준비사항</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-pink-500">•</span>
                <span>여권 유효기간 6개월 이상</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-pink-500">•</span>
                <span>90일 무비자 입국 가능</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-pink-500">•</span>
                <span>IC카드(스이카/파스모) 준비</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-pink-500">•</span>
                <span>현금 위주 사회 (엔화 환전)</span>
              </li>
            </ul>
          </div>

          {/* 추천 음식 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">꼭 먹어봐야 할 음식</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-green-500">🍣</span>
                <span>신선한 회와 스시</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500">🍜</span>
                <span>정통 라멘 (돈코츠, 미소)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500">🥩</span>
                <span>와규 스테이크</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-500">🍱</span>
                <span>에키벤 (역 도시락)</span>
              </li>
            </ul>
          </div>

          {/* 교통 정보 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-blue-600">교통 정보</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">🚅</span>
                <span>JR패스로 신칸센 이용</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">🚇</span>
                <span>지하철 1일권 구매</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">🚌</span>
                <span>관광지 순환버스 이용</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-500">🚶</span>
                <span>걷기 좋은 도시들</span>
              </li>
            </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
