'use client'

import { MapPin, Calendar, Users, Star, Clock, Plane, Mountain, Camera } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getHeroImage, HeroImage } from '@/lib/heroImages'

export default function TaiwanPage() {
  const router = useRouter();
  const [heroImage, setHeroImage] = useState<HeroImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHeroImage() {
      try {
        const heroImg = await getHeroImage('overseas', 'taiwan');
        console.log('대만 페이지: 히어로 이미지:', heroImg);
        setHeroImage(heroImg);
      } catch (error) {
        console.error('대만 히어로 이미지 로딩 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHeroImage();
  }, []);

  const packages = [
    {
      id: 1,
      title: '대만 타이베이 101 타워 3일',
      price: '650,000',
      duration: '3일 2박',
      rating: 4.6,
      image: '/images/taiwan-taipei.jpg',
      highlights: ['타이베이 101', '야시장', '궁다오 스카이라인', '딤섬'],
      departure: '매일 출발'
    },
    {
      id: 2,
      title: '대만 타이베이 & 타이중 5일',
      price: '890,000',
      duration: '5일 3박',
      rating: 4.7,
      image: '/images/taiwan-taichung.jpg',
      highlights: ['타이베이', '타이중', '일월담', '고궁박물관'],
      departure: '매일 출발'
    },
    {
      id: 3,
      title: '대만 일주 완전정복 8일',
      price: '1,290,000',
      duration: '8일 6박',
      rating: 4.8,
      image: '/images/taiwan-tour.jpg',
      highlights: ['타이베이', '화련', '타이둥', '가오슝', '전 지역'],
      departure: '매일 출발'
    },
    {
      id: 4,
      title: '대만 화련 타로코 협곡 4일',
      price: '790,000',
      duration: '4일 2박',
      rating: 4.5,
      image: '/images/taiwan-taroko.jpg',
      highlights: ['타로코 협곡', '화련', '대리석 협곡', '자연경관'],
      departure: '매일 출발'
    },
    {
      id: 5,
      title: '대만 가오슝 & 타이난 5일',
      price: '860,000',
      duration: '5일 3박',
      rating: 4.6,
      image: '/images/taiwan-kaohsiung.jpg',
      highlights: ['가오슝', '타이난', '애견원', '전통문화'],
      departure: '매일 출발'
    },
    {
      id: 6,
      title: '대만 일월담 & 아리산 6일',
      price: '990,000',
      duration: '6일 4박',
      rating: 4.8,
      image: '/images/taiwan-alishan.jpg',
      highlights: ['일월담', '아리산', '일출관광', '원주민문화'],
      departure: '매일 출발'
    }
  ];

  // 히어로 이미지 데이터 또는 기본값
  const backgroundImage = heroImage?.image_url || '/images/taiwan-hero.jpg'
  const gradientOverlay = heroImage?.gradient_overlay || 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(101, 163, 13, 0.3) 100%)'
  const title = heroImage?.title || '대만'
  const subtitle = heroImage?.subtitle || '섬나라의 아름다운 자연과 따뜻한 정겨움'

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `${gradientOverlay}, url('${backgroundImage}')`
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">{title}</h1>
            <p className="text-xl mb-6 drop-shadow-md">{subtitle}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                아시아의 보석 같은 섬
              </span>
              <span className="flex items-center gap-1">
                <Plane className="w-4 h-4" />
                인천공항에서 직항 2시간 30분
              </span>
              <span className="flex items-center gap-1">
                <Mountain className="w-4 h-4" />
                자연과 문화의 조화
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">대만 여행 패키지</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              따뜻한 기후와 친근한 사람들, 맛있는 음식과 아름다운 자연이 있는 대만으로 떠나보세요
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="relative h-48">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-center px-4">{pkg.title}</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">{pkg.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{pkg.departure}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight, index) => (
                        <span key={index} className="bg-emerald-50 text-emerald-600 text-xs px-2 py-1 rounded-full">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-emerald-600">₩{pkg.price}</span>
                      <span className="text-gray-500 text-sm">/인</span>
                    </div>
                    <button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      onClick={() => router.push(`/package/${pkg.id}`)}
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

      {/* Info Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">대만 여행 정보</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">교통편</h3>
              <p className="text-gray-600">
                인천공항에서 직항 2시간 30분<br/>
                무비자 30일 체류 가능
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">자연경관</h3>
              <p className="text-gray-600">
                타로코 협곡, 일월담<br/>
                아리산, 양명산 국립공원
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-lime-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">명소</h3>
              <p className="text-gray-600">
                타이베이 101, 야시장<br/>
                고궁박물관, 지우펀
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-white rounded-xl shadow-md p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">여행 기본 정보</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 화폐: 신타이완달러 (TWD)</li>
                  <li>• 언어: 중국어 (번체자)</li>
                  <li>• 시차: 한국과 1시간 차이 (한국이 1시간 빠름)</li>
                  <li>• 기후: 아열대성 기후</li>
                  <li>• 전압: 110V</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">추천 여행 시기</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 봄 (3-5월): 날씨가 온화하고 쾌적</li>
                  <li>• 가을 (9-11월): 태풍이 지나가고 선선함</li>
                  <li>• 여름 (6-8월): 덥고 습하지만 과일이 맛있음</li>
                  <li>• 겨울 (12-2월): 온화하지만 북부는 비가 많음</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
