'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Thermometer } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SoutheastAsiaPage() {
  const router = useRouter();
  
  const packages = [
    {
      id: 'southeast-asia-thailand',
      title: '태국 방콕 & 파타야 5일',
      price: '890,000',
      duration: '5일 3박',
      rating: 4.8,
      image: '/images/thailand.jpg',
      highlights: ['왕궁', '왓포', '파타야 비치', '수상시장'],
      departure: '매일 출발'
    },
    {
      id: 'southeast-asia-vietnam',
      title: '베트남 다낭 & 호이안 5일',
      price: '1,190,000',
      duration: '5일 3박',
      rating: 4.7,
      image: '/images/vietnam.jpg',
      highlights: ['바나힐', '미케 비치', '호이안 구시가지', '한시장'],
      departure: '매일 출발'
    },
    {
      id: 'southeast-asia-singapore',
      title: '싱가포르 & 말레이시아 6일',
      price: '1,490,000',
      duration: '6일 4박',
      rating: 4.9,
      image: '/images/singapore.jpg',
      highlights: ['마리나베이샌즈', '센토사', '쿠알라룸푸르', '페트로나스 타워'],
      departure: '매주 화/금/일 출발'
    },
    {
      id: 'southeast-asia-philippines',
      title: '필리핀 세부 리조트 5일',
      price: '1,290,000',
      duration: '5일 3박',
      rating: 4.6,
      image: '/images/cebu.jpg',
      highlights: ['막탄 리조트', '보홀섬', '알로나 비치', '스노클링'],
      departure: '매주 월/수/금/일 출발'
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">동남아시아</h1>
            <p className="text-xl mb-6">열대의 낙원에서 즐기는 완벽한 휴양과 모험</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                태국, 베트남, 필리핀, 싱가포르
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                직항 3-7시간
              </span>
            </div>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
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
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    인기
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">동남아시아</span>
                  </div>
                  
                  {/* 여행 정보 */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 2).map((highlight, index) => (
                        <span 
                          key={index}
                          className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full"
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
                      <span className="text-xl font-bold text-green-600">{pkg.price}원</span>
                      <span className="text-gray-500 text-xs">/1인</span>
                    </div>
                    <button 
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                      onClick={() => router.push(`/package/${pkg.id}`)}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 동남아 여행 정보 */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
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
