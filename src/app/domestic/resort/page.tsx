'use client'

import { MapPin, Star, Calendar, Waves, Palmtree, Utensils } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DomesticResortPage() {
  const router = useRouter();
  const resorts = [
    {
      id: '1',
      name: '제주 신화월드 리조트',
      location: '제주도',
      image: '/images/resort-jeju.jpg',
      rating: 5,
      price: '250,000',
      features: ['워터파크', '테마파크', '골프장'],
    },
    {
      id: '2',
      name: '강원도 알펜시아 리조트',
      location: '평창, 강원도',
      image: '/images/resort-pyeongchang.jpg',
      rating: 5,
      price: '280,000',
      features: ['스키장', '워터파크', '스파'],
    },
    {
      id: '3',
      name: '경주 보문단지 리조트',
      location: '경주, 경상북도',
      image: '/images/resort-gyeongju.jpg',
      rating: 4,
      price: '220,000',
      features: ['골프장', '온천', '불국사 인근'],
    },
    {
      id: '4',
      name: '부산 해운대 프라이빗 리조트',
      location: '해운대, 부산',
      image: '/images/resort-busan.jpg',
      rating: 5,
      price: '320,000',
      features: ['오션뷰', '인피니티풀', '스파'],
    },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">국내 리조트</h1>
            <p className="text-xl mb-6">가족과 함께 휴일을 특별하게 만들어주는 주말 로컬 바케이션</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                제주도, 강원도, 경주, 부산
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                종합 리조트 & 테마파크
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Resorts Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">추천 국내 리조트</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              가족과 함께 즐길 수 있는 다양한 시설과 액티비티가 준비된 국내 최고의 리조트들
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resorts.map((resort) => (
              <div 
                key={resort.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => router.push(`/package/domestic-resort-${resort.id}`)}
              >
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">{resort.name}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{resort.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resort.name}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{resort.location}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {resort.features.map((feature, index) => (
                        <span key={index} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{resort.price}</span>
                      <span className="text-gray-500 text-sm">원/박</span>
                    </div>
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/package/domestic-resort-${resort.id}`);
                      }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resort Activities Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">리조트 액티비티</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">워터파크</h3>
              <p className="text-gray-600">계절에 상관없이 즐길 수 있는 실내외 워터파크와 다양한 물놀이 시설</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palmtree className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">자연 체험</h3>
              <p className="text-gray-600">아름다운 자연환경에서 즐기는 다양한 아웃도어 액티비티</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">미식 체험</h3>
              <p className="text-gray-600">지역 특산물과 시즌 메뉴를 활용한 다양한 레스토랑</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
