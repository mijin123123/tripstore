'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Building2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getPackagesByRegion } from '@/data/packages'

export default function ChinaHongkongPage() {
  const router = useRouter();
  const chinaPackages = getPackagesByRegion('overseas', 'china-hongkong');
  
  const packages = [
    {
      id: 'china-hongkong-1',
      title: '홍콩 & 마카오 3일',
      price: '890,000',
      duration: '3일 1박',
      rating: 4.7,
      image: '/images/hongkong.jpg',
      highlights: ['빅토리아 피크', '심포니 오브 라이츠', '베네시안 마카오', '딤섬'],
      departure: '매일 출발'
    },
    {
      id: 'china-hongkong-2',
      title: '대만 타이베이 & 타이중 5일',
      price: '1,290,000',
      duration: '5일 3박',
      rating: 4.8,
      image: '/images/taiwan.jpg',
      highlights: ['101타워', '야시장', '지우펀', '타로코 협곡'],
      departure: '매일 출발'
    },
    {
      id: 'china-hongkong-3',
      title: '홍콩 디즈니랜드 가족여행 4일',
      price: '1,490,000',
      duration: '4일 2박',
      rating: 4.9,
      image: '/images/hongkong-disney.jpg',
      highlights: ['디즈니랜드', '오션파크', '스타페리', '템플스트리트'],
      departure: '매주 금/토/일 출발'
    },
    {
      id: 'china-hongkong-4',
      title: '대만 일주 완전정복 8일',
      price: '2,190,000',
      duration: '8일 6박',
      rating: 4.6,
      image: '/images/taiwan-tour.jpg',
      highlights: ['타이베이', '타이중', '가오슝', '화련'],
      departure: '매주 화/토 출발'
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">중국/홍콩</h1>
            <p className="text-xl mb-6">다채로운 문화와 쇼핑의 천국을 경험하세요</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                홍콩, 마카오, 상해, 베이징
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                직항 2-4시간
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 패키지 리스트 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => router.push(`/package/${pkg.id}`)}
            >
              <div className="relative h-48">
                <div className="w-full h-full">
                  {pkg.image ? (
                    <img 
                      src={pkg.image} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <span className="text-white font-semibold absolute inset-0 flex items-center justify-center">{pkg.title}</span>
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                  </div>
                </div>
                {pkg.id === 'china-hongkong-3' && (
                  <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    가족추천
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Plane className="w-4 h-4" />
                    <span>{pkg.departure}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {pkg.highlights.map((highlight, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-purple-600">
                      {pkg.price}원
                    </span>
                    <span className="text-gray-500 text-xs">/ 1인</span>
                  </div>
                  <button 
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
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
        <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">여행 가이드</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="font-bold mb-3 text-purple-600">입국 정보</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 대만: 무비자 30일</li>
                <li>• 홍콩: 무비자 90일</li>
                <li>• 마카오: 무비자 30일</li>
                <li>• 여권 유효기간 6개월</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-blue-600">언어 & 통화</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 중국어(번체), 영어</li>
                <li>• 대만: 신타이완달러</li>
                <li>• 홍콩: 홍콩달러</li>
                <li>• 마카오: 마카오파타카</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-green-600">먹거리</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 야시장 길거리음식</li>
                <li>• 딤섬, 완탕면</li>
                <li>• 망고빙수</li>
                <li>• 펄밀크티</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3 text-orange-600">쇼핑</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 면세점, 아울렛</li>
                <li>• 야시장, 전통시장</li>
                <li>• 차이나타운</li>
                <li>• 로컬 브랜드</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
