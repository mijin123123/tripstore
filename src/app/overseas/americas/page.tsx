'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Mountain, Building } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getPackagesByRegion } from '@/data/packages'

export default function AmericasPage() {
  const router = useRouter();
  const packages = getPackagesByRegion('overseas', 'americas');

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-red-600 to-blue-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">아메리카</h1>
            <p className="text-xl mb-6">광활한 대륙과 아름다운 자연을 만나보세요</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                미국, 캐나다, 하와이, 남미
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                직항 8-14시간
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 패키지 리스트 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 미주 여행</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              광활한 대륙과 웅장한 자연을 만날 수 있는 특별한 여행
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer" onClick={() => router.push(`/package/${pkg.id}`)}>
                {/* 이미지 섹션 */}
                <div className="relative h-48">
                  <img 
                    src={pkg.image} 
                    alt={pkg.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">아메리카</span>
                  </div>
                  
                  {/* 여행 정보 */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 2).map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Plane className="w-4 h-4" />
                      <span>{pkg.departure}</span>
                    </div>
                  </div>
                  
                  {/* 가격 및 예약 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-red-600">{pkg.price}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
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

          {/* 여행 정보 */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">미주 여행 가이드</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">비자 정보</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>ESTA 사전 신청 (미국)</li>
                  <li>ETA 전자여행허가 (캐나다)</li>
                  <li>여권 유효기간 6개월 이상</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">베스트 시즌</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>서부: 4-6월, 9-10월</li>
                  <li>동부: 5-9월</li>
                  <li>하와이: 연중</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">교통</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>렌터카 추천</li>
                  <li>국내선 항공편</li>
                  <li>시티투어 버스</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">현지 정보</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>팁 문화 (15-20%)</li>
                  <li>신용카드 필수</li>
                  <li>세금 별도 계산</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 지역 소개 섹션 */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 bg-gradient-to-r from-blue-500 to-red-500 flex items-center justify-center">
                <Mountain className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">대자연의 웅장함</h3>
                <p className="text-gray-600">
                  그랜드캐년의 장엄한 풍경부터 옐로스톤의 신비로운 자연현상까지, 
                  미국은 세계적인 국립공원과 아름다운 자연 명소를 자랑합니다. 
                  로키 산맥, 나이아가라 폭포 등 웅장한 자연을 직접 경험해 보세요.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-56 bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center">
                <Building className="w-24 h-24 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">다양한 문화와 도시</h3>
                <p className="text-gray-600">
                  뉴욕의 역동적인 도시 풍경부터 LA의 햇살 가득한 해변까지, 
                  미국과 캐나다의 도시들은 각기 다른 매력을 지니고 있습니다.
                  세계적인 박물관, 미슐랭 레스토랑, 화려한 엔터테인먼트를 경험하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
