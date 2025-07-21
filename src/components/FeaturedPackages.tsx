'use client'

import { Clock, Users, Star, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Package {
  id: string
  title: string
  description: string
  image: string
  duration: string
  group: string
  rating: string
  originalPrice: number
  currentPrice: number
  badge: string
  destination: string
  type?: string
  region?: string
  regionKo?: string
}

const FeaturedPackages = () => {
  const router = useRouter();
  const packages: Package[] = [
    {
      id: '1',
      title: '파리 로맨틱 5일',
      description: '에펠탑, 루브르 박물관, 베르사유 궁전을 둘러보는 낭만적인 파리 여행',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80',
      duration: '5일 4박',
      group: '최대 20명',
      rating: '4.8',
      originalPrice: 2800000,
      currentPrice: 2380000,
      badge: '베스트',
      destination: '프랑스 파리',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽'
    },
    {
      id: '2',
      title: '일본 도쿄 벚꽃 여행',
      description: '아름다운 벚꽃과 함께하는 도쿄 명소 투어, 온천과 전통 문화 체험',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: '4일 3박',
      group: '최대 25명',
      rating: '4.9',
      originalPrice: 1800000,
      currentPrice: 1620000,
      badge: '인기',
      destination: '일본 도쿄',
      type: 'overseas',
      region: 'japan',
      regionKo: '일본'
    },
    {
      id: '3',
      title: '미국 뉴욕 자유여행',
      description: '자유의 여신상, 타임스퀘어, 센트럴파크 등 뉴욕의 랜드마크 탐방',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: '6일 5박',
      group: '최대 15명',
      rating: '4.7',
      originalPrice: 3500000,
      currentPrice: 3150000,
      badge: '특가',
      destination: '미국 뉴욕',
      type: 'overseas',
      region: 'americas',
      regionKo: '미주'
    },
    {
      id: '4',
      title: '이탈리아 문화기행',
      description: '로마, 피렌체, 베네치아의 역사와 예술을 만나는 문화 여행',
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: '8일 7박',
      group: '최대 20명',
      rating: '4.8',
      originalPrice: 4200000,
      currentPrice: 3780000,
      badge: '프리미엄',
      destination: '이탈리아',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽'
    },
    {
      id: '5',
      title: '영국 클래식 투어',
      description: '런던의 역사와 전통, 스코틀랜드의 신비로운 성들을 탐험',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: '7일 6박',
      group: '최대 18명',
      rating: '4.6',
      originalPrice: 3800000,
      currentPrice: 3420000,
      badge: '클래식',
      destination: '영국',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽'
    },
    {
      id: '6',
      title: '스페인 정열기행',
      description: '바르셀로나와 마드리드의 가우디 건축과 플라멘코 문화 체험',
      image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      duration: '6일 5박',
      group: '최대 22명',
      rating: '4.5',
      originalPrice: 3200000,
      currentPrice: 2880000,
      badge: '인기',
      destination: '스페인',
      type: 'overseas',
      region: 'europe',
      regionKo: '유럽'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            인기 여행 패키지
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            전문가가 엄선한 최고의 여행 패키지를 만나보세요. 
            특별한 할인 혜택과 함께 잊지 못할 여행을 경험하실 수 있습니다.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
              onClick={() => router.push(`/package/${pkg.id}`)}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={pkg.image} 
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {pkg.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                
                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{pkg.destination}</span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {pkg.description}
                </p>

                {/* Details */}
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{pkg.group}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{pkg.rating}</span>
                  </div>
                </div>

                {/* Price & Button */}
                <div className="flex justify-between items-center">
                  <div>
                    {pkg.originalPrice !== pkg.currentPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {pkg.originalPrice.toLocaleString()}원
                      </span>
                    )}
                    <div className="text-xl font-bold text-blue-500">
                      {pkg.currentPrice.toLocaleString()}
                      <span className="text-xs text-gray-500 ml-1">원</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-primary btn-sm"
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
      </div>
    </section>
  )
}

export default FeaturedPackages
