'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Cherry, Mountain } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function JapanPage() {
  const router = useRouter();
  
  const packages = [
    {
      id: 'japan-tokyo-osaka',
      title: '도쿄 & 오사카 벚꽃 여행 5일',
      price: '1,890,000',
      duration: '5일 3박',
      rating: 4.9,
      image: '/images/japan-tokyo.jpg',
      highlights: ['시부야', '아사쿠사', '오사카성', '벚꽃 명소'],
      departure: '3-5월 매일 출발',
      season: '벚꽃시즌'
    },
    {
      id: 'japan-kyushu',
      title: '규슈 온천 힐링 여행 6일',
      price: '2,190,000',
      duration: '6일 4박',
      rating: 4.8,
      image: '/images/japan-kyushu.jpg',
      highlights: ['벳푸 온천', '유후인', '구마모토성', '아소산'],
      departure: '연중 출발',
      season: '온천'
    },
    {
      id: 'japan-hokkaido',
      title: '홋카이도 삿포로 & 하코다테 7일',
      price: '2,690,000',
      duration: '7일 5박',
      rating: 4.7,
      image: '/images/japan-hokkaido.jpg',
      highlights: ['삿포로 맥주공장', '오타루 운하', '하코다테 야경', '니세코'],
      departure: '6-9월, 12-2월 출발',
      season: '여름/겨울'
    },
    {
      id: 'japan-kyoto',
      title: '교토 & 나라 전통문화 5일',
      price: '1,790,000',
      duration: '5일 3박',
      rating: 4.8,
      image: '/images/japan-kyoto.jpg',
      highlights: ['후시미 이나리', '기요미즈데라', '나라 사슴공원', '가와라마치'],
      departure: '연중 매일 출발',
      season: '전통문화'
    }
  ]

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
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* 이미지 섹션 */}
                <div className="relative h-48">
                  <div className="w-full h-full">
                    {pkg.image ? (
                      <img 
                        src={pkg.image} 
                        alt={pkg.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-pink-400 to-red-500 flex items-center justify-center">
                        <span className="text-white font-semibold">{pkg.title}</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  </div>
                  {pkg.season && (
                    <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {pkg.season}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">일본</span>
                  </div>
                  
                  {/* 여행 정보 */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 2).map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full"
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
                      <span className="text-xl font-bold text-pink-600">{pkg.price}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors"
                      onClick={() => router.push(`/package/${pkg.id}`)}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

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
