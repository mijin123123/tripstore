'use client'

import { useState } from 'react'
import { ArrowLeft, Star, MapPin, Calendar, Users, Clock, Heart, Share2, Camera, Wifi, Car, Utensils, Shield } from 'lucide-react'

interface PackageDetail {
  id: number
  title: string
  location: string
  price: number
  originalPrice: number
  duration: string
  rating: number
  reviews: number
  images: string[]
  description: string
  includes: string[]
  excludes: string[]
  itinerary: {
    day: number
    title: string
    description: string
    activities: string[]
  }[]
  amenities: string[]
  highlights: string[]
}

const packageDetail: PackageDetail = {
  id: 1,
  title: '일본 도쿄 & 오사카 5일 완벽 투어',
  location: '일본 도쿄, 오사카',
  price: 1200000,
  originalPrice: 1500000,
  duration: '4박 5일',
  rating: 4.8,
  reviews: 324,
  images: [
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80',
    'https://images.unsplash.com/photo-1542640244-7e672d6cef4e?w=800&q=80'
  ],
  description: '일본의 전통과 현대가 만나는 도쿄와 오사카를 4박 5일간 완벽하게 체험할 수 있는 패키지입니다. 현지 전문 가이드와 함께 숨겨진 명소부터 유명 관광지까지 모두 경험하세요.',
  includes: [
    '왕복 항공료',
    '4박 호텔 숙박 (4성급)',
    '전 일정 조식',
    '현지 전문 가이드',
    '관광지 입장료',
    '전용 차량',
    '여행자 보험'
  ],
  excludes: [
    '점심/저녁 식사',
    '개인 경비',
    '선택 관광',
    '여권 발급비',
    '공항세',
    '팁'
  ],
  itinerary: [
    {
      day: 1,
      title: '인천 → 도쿄 출발',
      description: '인천공항에서 도쿄 하네다공항으로 이동',
      activities: ['인천공항 출발', '도쿄 하네다공항 도착', '호텔 체크인', '자유시간']
    },
    {
      day: 2,
      title: '도쿄 시내 관광',
      description: '도쿄의 대표 관광지들을 둘러보는 알찬 하루',
      activities: ['아사쿠사 센소지', '도쿄 스카이트리', '우에노 공원', '긴자 쇼핑']
    },
    {
      day: 3,
      title: '후지산 & 하코네 투어',
      description: '일본의 상징 후지산과 온천으로 유명한 하코네',
      activities: ['후지산 5합목', '하코네 온천', '아시호수', '평화공원']
    },
    {
      day: 4,
      title: '오사카 이동 & 시내 관광',
      description: '신칸센으로 오사카 이동 후 오사카 관광',
      activities: ['신칸센 탑승', '오사카성', '도톤보리', '신세계']
    },
    {
      day: 5,
      title: '오사카 → 인천 귀국',
      description: '마지막 쇼핑과 함께 귀국',
      activities: ['자유시간', '간사이공항 출발', '인천공항 도착']
    }
  ],
  amenities: ['Wi-Fi', '에어컨', '전용 차량', '현지 가이드'],
  highlights: ['온천 체험', '후지산 투어', '신칸센 체험', '전통 문화 체험']
}

export default function PackageDetail() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [travelers, setTravelers] = useState(2)
  const [selectedDate, setSelectedDate] = useState('')

  const handleBooking = () => {
    console.log('예약하기:', { travelers, selectedDate })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5 mr-2" />
              돌아가기
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-red-600">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative">
                <img 
                  src={packageDetail.images[selectedImage]} 
                  alt={packageDetail.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  <Camera className="h-4 w-4 inline mr-1" />
                  {selectedImage + 1} / {packageDetail.images.length}
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                {packageDetail.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`이미지 ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{packageDetail.title}</h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    {packageDetail.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{packageDetail.rating}</span>
                    <span className="ml-1 text-gray-600">({packageDetail.reviews}개 리뷰)</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {packageDetail.duration}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {packageDetail.highlights.map((highlight, index) => (
                  <span key={index} className="bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full">
                    {highlight}
                  </span>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{packageDetail.description}</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: '개요' },
                    { id: 'itinerary', label: '일정' },
                    { id: 'includes', label: '포함사항' },
                    { id: 'reviews', label: '리뷰' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        selectedTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {selectedTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">편의시설</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {packageDetail.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center text-gray-600">
                            <Wifi className="h-4 w-4 mr-2" />
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'itinerary' && (
                  <div className="space-y-6">
                    {packageDetail.itinerary.map((day, index) => (
                      <div key={index} className="border-l-4 border-primary-500 pl-6 pb-6">
                        <div className="flex items-center mb-2">
                          <span className="bg-primary-500 text-white text-sm font-semibold px-2 py-1 rounded">
                            DAY {day.day}
                          </span>
                          <h4 className="text-lg font-semibold ml-3">{day.title}</h4>
                        </div>
                        <p className="text-gray-600 mb-3">{day.description}</p>
                        <ul className="space-y-1">
                          {day.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="text-gray-700 flex items-center">
                              <span className="w-2 h-2 bg-primary-400 rounded-full mr-3"></span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTab === 'includes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-green-600">포함 사항</h3>
                      <ul className="space-y-2">
                        {packageDetail.includes.map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-red-600">불포함 사항</h3>
                      <ul className="space-y-2">
                        {packageDetail.excludes.map((item, index) => (
                          <li key={index} className="text-gray-700 flex items-center">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary-600 mb-2">{packageDetail.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600">{packageDetail.reviews}개의 리뷰</p>
                    </div>
                    <div className="text-center text-gray-500 py-8">
                      리뷰 기능은 곧 추가될 예정입니다.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-8">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-3xl font-bold text-primary-600">
                    {packageDetail.price.toLocaleString()}원
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {packageDetail.originalPrice.toLocaleString()}원
                  </span>
                </div>
                <p className="text-sm text-green-600 font-semibold">
                  {Math.round(((packageDetail.originalPrice - packageDetail.price) / packageDetail.originalPrice) * 100)}% 할인!
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    출발일
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    인원
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={1}>1명</option>
                    <option value={2}>2명</option>
                    <option value={3}>3명</option>
                    <option value={4}>4명</option>
                    <option value={5}>5명 이상</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">기본 요금 ({travelers}명)</span>
                  <span className="font-semibold">{(packageDetail.price * travelers).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">세금 및 수수료</span>
                  <span className="font-semibold">포함</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">총 금액</span>
                    <span className="font-bold text-xl text-primary-600">
                      {(packageDetail.price * travelers).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
              >
                지금 예약하기
              </button>

              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                장바구니 담기
              </button>

              <div className="mt-6 text-sm text-gray-600">
                <p className="flex items-center mb-2">
                  <Shield className="h-4 w-4 mr-2" />
                  안전한 결제 시스템
                </p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  무료 취소 (출발 7일 전까지)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
