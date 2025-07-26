'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Users, Star, Bed, Wifi, Car, Building, Coffee, Shield, ChevronLeft, ChevronRight } from 'lucide-react'

export default function HotelPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const regionsPerPage = 12
  const regions = [
    {
      name: '유럽',
      slug: 'europe',
      image: '/images/hotel-europe.jpg',
      description: '럭셔리 호텔부터 부티크 호텔까지',
      hotels: 25,
      rating: 4.8,
      priceRange: '150,000 - 500,000원'
    },
    {
      name: '동남아',
      slug: 'southeast-asia', 
      image: '/images/hotel-sea.jpg',
      description: '리조트와 비치프론트 호텔',
      hotels: 30,
      rating: 4.7,
      priceRange: '80,000 - 300,000원'
    },
    {
      name: '일본',
      slug: 'japan',
      image: '/images/hotel-japan.jpg', 
      description: '료칸부터 모던 호텔까지',
      hotels: 20,
      rating: 4.9,
      priceRange: '120,000 - 400,000원'
    },
    {
      name: '괌/사이판',
      slug: 'guam-saipan',
      image: '/images/hotel-guam.jpg',
      description: '오션뷰 리조트 호텔',
      hotels: 15,
      rating: 4.6,
      priceRange: '200,000 - 450,000원'
    },
    {
      name: '미주/캐나다/하와이',
      slug: 'americas',
      image: '/images/hotel-america.jpg',
      description: '도심 호텔과 리조트',
      hotels: 18,
      rating: 4.8,
      priceRange: '180,000 - 600,000원'
    },
    {
      name: '대만/홍콩/마카오',
      slug: 'china-hongkong',
      image: '/images/hotel-hongkong.jpg',
      description: '도심 럭셔리 호텔',
      hotels: 22,
      rating: 4.5,
      priceRange: '100,000 - 350,000원'
    }
  ]

  // 페이지네이션 계산
  const totalPages = Math.ceil(regions.length / regionsPerPage)
  const startIndex = (currentPage - 1) * regionsPerPage
  const endIndex = startIndex + regionsPerPage
  const currentRegions = regions.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hotelFeatures = [
    {
      title: '엄선된 호텔',
      description: '전 세계 검증된 프리미엄 호텔만 선별',
      icon: Building
    },
    {
      title: '최저가 보장',
      description: '동일 조건 더 저렴한 가격 발견 시 차액 환불',
      icon: Star
    },
    {
      title: '무료 취소',
      description: '체크인 24시간 전까지 무료 취소 가능',
      icon: Shield
    },
    {
      title: '24시간 지원',
      description: '언제든지 연락 가능한 고객 지원 서비스',
      icon: Coffee
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Hero 섹션 */}
        <div className="relative h-80 rounded-xl mb-12 overflow-hidden">
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/hotel-hero.jpg'), linear-gradient(135deg, #065f46 0%, #047857 50%, #0d9488 100%)`
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative h-full flex items-center justify-center text-center text-white z-10">
            <div>
              <Building className="w-16 h-16 mx-auto mb-4 text-emerald-300" />
              <h1 className="text-5xl font-bold mb-4">호텔 예약</h1>
              <p className="text-xl opacity-90 max-w-2xl">
                전 세계 최고의 호텔에서 완벽한 숙박 경험을 만들어보세요
              </p>
            </div>
          </div>
        </div>

        {/* 호텔 서비스 소개 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {hotelFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* 지역별 호텔 카드 그리드 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {currentRegions.map((region) => (
            <Link 
              key={region.slug}
              href={`/hotel/${region.slug}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <div className="w-full h-full">
                  {region.image ? (
                    <img 
                      src={region.image} 
                      alt={region.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{region.name}</h3>
                  <p className="text-sm opacity-90">{region.description}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Bed className="w-4 h-4" />
                    <span className="text-sm">{region.hotels}개 호텔</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    {region.priceRange}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-4 h-4" />
                    <span>무료 WiFi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Car className="w-4 h-4" />
                    <span>공항 셔틀</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 */}
        {regions.length > regionsPerPage && (
          <div className="flex justify-center items-center mb-16 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-2 rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* 호텔 예약 팁 */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">호텔 예약 팁</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">예약 시기</h3>
              <p className="text-gray-600 text-sm">여행 2-3개월 전 예약 시 할인 혜택</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">위치 선택</h3>
              <p className="text-gray-600 text-sm">관광지와 교통편을 고려한 위치 선택</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">리뷰 확인</h3>
              <p className="text-gray-600 text-sm">실제 투숙객 리뷰와 평점 꼼꼼히 확인</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">멤버십 혜택</h3>
              <p className="text-gray-600 text-sm">호텔 체인 멤버십 가입으로 추가 혜택</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
