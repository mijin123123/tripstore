'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Calendar, Users, Star, Plane, Globe, Heart, Clock, ChevronLeft, ChevronRight } from 'lucide-react'

export default function OverseasPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const packagesPerPage = 12
  const packages = [
    {
      id: 1,
      title: '유럽 로맨틱 투어 7일',
      price: '2,890,000',
      duration: '7일 5박',
      rating: 4.8,
      image: '/images/europe.jpg',
      highlights: ['파리', '런던', '로마', '바르셀로나'],
      departure: '매주 화/금 출발',
      link: '/overseas/europe'
    },
    {
      id: 2,
      title: '동남아 휴양지 투어 5일',
      price: '1,590,000',
      duration: '5일 3박',
      rating: 4.7,
      image: '/images/southeast-asia.jpg',
      highlights: ['태국', '베트남', '필리핀', '싱가포르'],
      departure: '매일 출발',
      link: '/overseas/southeast-asia'
    },
    {
      id: 3,
      title: '일본 벚꽃 여행 5일',
      price: '1,890,000',
      duration: '5일 3박',
      rating: 4.9,
      image: '/images/japan.jpg',
      highlights: ['도쿄', '오사카', '교토', '홋카이도'],
      departure: '3-5월 매일 출발',
      link: '/overseas/japan'
    },
    {
      id: 4,
      title: '괌/사이판 휴양 4일',
      price: '890,000',
      duration: '4일 2박',
      rating: 4.6,
      image: '/images/guam.jpg',
      highlights: ['괌', '사이판', '로타', '티니안'],
      departure: '매주 화/금/일 출발',
      link: '/overseas/guam-saipan'
    },
    {
      id: 5,
      title: '미주 대자연 투어 9일',
      price: '4,590,000',
      duration: '9일 7박',
      rating: 4.8,
      image: '/images/americas.jpg',
      highlights: ['미국', '캐나다', '하와이', '남미'],
      departure: '매주 수/토 출발',
      link: '/overseas/americas'
    },
    {
      id: 6,
      title: '홍콩/마카오 쇼핑 투어 4일',
      price: '1,290,000',
      duration: '4일 2박',
      rating: 4.5,
      image: '/images/hongkong.jpg',
      highlights: ['홍콩', '마카오', '상해', '베이징'],
      departure: '매일 출발',
      link: '/overseas/china-hongkong'
    }
  ]

  // 페이지네이션 계산
  const totalPages = Math.ceil(packages.length / packagesPerPage)
  const startIndex = (currentPage - 1) * packagesPerPage
  const endIndex = startIndex + packagesPerPage
  const currentPackages = packages.slice(startIndex, endIndex)

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const travelFeatures = [
    {
      title: '무료 일정 변경',
      description: '출발 7일 전까지 무료로 일정 변경 가능',
      icon: Calendar
    },
    {
      title: '전문 가이드',
      description: '현지 전문 가이드와 함께하는 안전한 여행',
      icon: Users
    },
    {
      title: '프리미엄 서비스',
      description: '24시간 고객 지원 및 프리미엄 서비스 제공',
      icon: Star
    },
    {
      title: '맞춤형 일정',
      description: '고객 취향에 맞춘 개인별 맞춤 여행',
      icon: Heart
    }
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-800 to-purple-700">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <div className="flex items-center gap-4 mb-4">
              <Plane className="w-12 h-12" />
              <h1 className="text-4xl md:text-5xl font-bold">해외여행</h1>
            </div>
            <p className="text-xl mb-6">전 세계의 아름다운 여행지에서 특별한 추억을 만들어보세요</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                전 세계 200개 도시
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                맞춤형 일정 상담
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-16">

        {/* 여행 서비스 소개 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {travelFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            )
          })}
        </div>

        {/* 패키지 리스트 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentPackages.map((pkg) => (
            <Link href={pkg.link} key={pkg.id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer duration-300">
                {/* 이미지 섹션 */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex-shrink-0 flex-shrink-0">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                  
                  {/* 여행 정보 */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="truncate">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Plane className="w-4 h-4" />
                      <span className="truncate">{pkg.departure}</span>
                    </div>
                  </div>

                  {/* 하이라이트 */}
                  <div className="mb-4 flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.slice(0, 4).map((highlight, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 가격 및 예약 */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900 mb-2">
                        {pkg.price}원
                      </span>
                      <span className="text-gray-500 text-xs">/ 1인</span>
                    </div>
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                      상세보기
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 페이지네이션 */}
        {packages.length > packagesPerPage && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-2 rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
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
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </button>
          </div>
        )}

        {/* 여행 팁 섹션 */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">해외여행 준비 가이드</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">여행 시기</h3>
              <p className="text-gray-600 text-sm">목적지별 최적의 여행 시기를 고려한 일정 계획</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">비자/여권</h3>
              <p className="text-gray-600 text-sm">국가별 비자 요건과 여권 유효기간 확인</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">여행보험</h3>
              <p className="text-gray-600 text-sm">해외 응급상황 대비 여행자 보험 가입</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">맞춤 상담</h3>
              <p className="text-gray-600 text-sm">개인 취향에 맞는 여행 일정 전문 상담</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
