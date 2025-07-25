import Link from 'next/link'
import { MapPin, Calendar, Users, Star, Crown, Ship, Sparkles, Plane } from 'lucide-react'

export default function LuxuryPage() {
  const categories = [
    {
      name: '유럽 럭셔리',
      slug: 'europe',
      icon: Crown,
      description: '유럽 귀족들의 우아한 여행',
      packages: 12,
      rating: 4.9,
      priceRange: '8,000,000 - 15,000,000원',
      highlights: ['미슐랭 레스토랑', '프라이빗 가이드', '럭셔리 호텔', '전용 차량']
    },
    {
      name: '일본 프리미엄',
      slug: 'japan',
      icon: Sparkles,
      description: '일본의 정통 럭셔리 체험',
      packages: 8,
      rating: 4.8,
      priceRange: '5,000,000 - 12,000,000원',
      highlights: ['료칸 스위트', '가이세키 요리', '프라이빗 온천', '문화 체험']
    },
    {
      name: '동남아 프리미엄',
      slug: 'southeast-asia',
      icon: Star,
      description: '열대 낙원의 최고급 휴양',
      packages: 10,
      rating: 4.7,
      priceRange: '4,000,000 - 10,000,000원',
      highlights: ['오버워터 빌라', '프라이빗 비치', '스파 트리트먼트', '요트 투어']
    },
    {
      name: '크루즈',
      slug: 'cruise',
      icon: Ship,
      description: '바다 위의 움직이는 호텔',
      packages: 6,
      rating: 4.8,
      priceRange: '3,000,000 - 8,000,000원',
      highlights: ['발코니 스위트', '전용 집사', '미식 레스토랑', '쇼 관람']
    },
    {
      name: '이색 테마',
      slug: 'special-theme',
      icon: Plane,
      description: '특별한 경험의 맞춤 여행',
      packages: 5,
      rating: 4.9,
      priceRange: '6,000,000 - 20,000,000원',
      highlights: ['사파리 투어', '오로라 관측', '사막 글램핑', '헬리콥터 투어']
    }
  ]

  const luxuryServices = [
    {
      title: '24시간 컨시어지',
      description: '전담 컨시어지가 여행 전 과정을 케어',
      icon: Users
    },
    {
      title: '프라이빗 전용기',
      description: '원하는 일정에 맞춘 전용기 서비스',
      icon: Plane
    },
    {
      title: '미슐랭 레스토랑',
      description: '세계 최고 레스토랑 예약 서비스',
      icon: Star
    },
    {
      title: '맞춤형 일정',
      description: '고객 취향에 100% 맞춘 특별 일정',
      icon: Crown
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* 헤더 섹션 */}
        <div className="relative h-80 rounded-xl mb-12 overflow-hidden">
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/luxury-hero.jpg'), linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #eab308 100%)`
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative h-full flex items-center justify-center text-center text-white z-10">
            <div>
              <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
              <h1 className="text-5xl font-bold mb-4">럭셔리 여행</h1>
              <p className="text-xl opacity-90 max-w-2xl">
                최고급 서비스와 독특한 경험이 어우러진 프리미엄 여행
              </p>
            </div>
          </div>
        </div>

        {/* 럭셔리 서비스 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {luxuryServices.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            )
          })}
        </div>

        {/* 럭셔리 카테고리 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link 
                key={category.slug}
                href={`/luxury/${category.slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="relative h-56 bg-gradient-to-br from-purple-600 via-purple-700 to-yellow-600">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-6 left-6">
                    <IconComponent className="w-12 h-12 text-yellow-300" />
                  </div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{category.packages}개 패키지</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm font-bold text-purple-600 mb-2">
                      {category.priceRange}
                    </div>
                    <div className="text-xs text-gray-500">1인 기준 / 항공료 포함</div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-700 text-sm">포함 서비스</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.highlights.map((highlight, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* 럭셔리 여행의 특별함 */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">왜 럭셔리 여행을 선택하나요?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="font-semibold mb-2">독점적 경험</h3>
              <p className="text-sm opacity-90">일반인이 접하기 어려운 특별한 경험과 장소</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="font-semibold mb-2">개인 맞춤 서비스</h3>
              <p className="text-sm opacity-90">고객의 취향과 니즈에 완벽히 맞춘 서비스</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </div>
              <h3 className="font-semibold mb-2">평생 기억</h3>
              <p className="text-sm opacity-90">돈으로 살 수 없는 소중한 추억과 경험</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
