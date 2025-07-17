'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Star, MapPin, Calendar, Users, Clock, Heart, Share2, Camera, Wifi, Car, Utensils, Shield } from 'lucide-react'
import { packageApi } from '../../lib/api'
import { supabase } from '../../lib/supabase'
import AuthModal from '../../components/AuthModal'

interface PackageDetail {
  id: string
  title: string
  location: string
  price: number
  original_price: number
  duration: string
  rating: number
  reviews: number
  images: string[]
  description: string
  highlights: string[]
  departure_date: string
  available_spots: number
}

export default function PackageDetail() {
  const searchParams = useSearchParams()
  const packageId = searchParams.get('id')
  const [packageDetail, setPackageDetail] = useState<PackageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedDate, setSelectedDate] = useState('')
  const [travelers, setTravelers] = useState(2)
  const [isLiked, setIsLiked] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  // 사용자 인증 상태 확인
  useEffect(() => {
    const checkUser = async () => {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
      }
    }
    checkUser()

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null)
        }
      )
      return () => subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        if (packageId) {
          const data = await packageApi.getPackageById(packageId)
          if (data) {
            setPackageDetail({
              ...data,
              images: data.images || []
            })
          }
        } else {
          // 기본 패키지 로드 (ID가 없는 경우)
          const packages = await packageApi.getAllPackages()
          if (packages.length > 0) {
            setPackageDetail({
              ...packages[0],
              images: packages[0].images || []
            })
          }
        }
      } catch (error) {
        console.error('패키지 상세 정보 로드 실패:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackageDetail()
  }, [packageId])

  const handleReservation = async () => {
    if (!packageDetail) return
    
    if (!user) {
      openAuthModal('login')
      return
    }
    
    try {
      // 예약 처리 로직 (향후 구현)
      alert('예약 기능은 곧 출시될 예정입니다!')
    } catch (error) {
      console.error('예약 실패:', error)
      alert('예약 처리 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
  }

  const openAuthModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">패키지 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!packageDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">패키지를 찾을 수 없습니다.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    )
  }

  const includes = [
    '왕복 항공료',
    '4박 호텔 숙박 (4성급)',
    '전 일정 조식',
    '현지 전문 가이드',
    '관광지 입장료',
    '전용 차량',
    '여행자 보험'
  ]

  const excludes = [
    '점심/저녁 식사',
    '개인 경비',
    '선택 관광',
    '여권 발급비',
    '공항세',
    '팁'
  ]

  const itinerary = [
    {
      day: 1,
      title: '인천 → 도쿄 출발',
      description: '인천공항에서 도쿄 하네다공항으로 이동',
      activities: ['인천공항 출발', '도쿄 하네다공항 도착', '호텔 체크인', '자유시간']
    },
    {
      day: 2,
      title: '도쿄 시내 관광',
      description: '도쿄의 대표적인 명소들을 둘러봅니다',
      activities: ['아사쿠사 센소지', '도쿄 스카이트리', '긴자 쇼핑', '시부야 크로싱']
    },
    {
      day: 3,
      title: '후지산 투어',
      description: '일본의 상징 후지산을 바라보며 온천 체험',
      activities: ['후지산 5합목', '하코네 온천', '아시노코 호수', '온천 료칸 체험']
    },
    {
      day: 4,
      title: '도쿄 → 오사카',
      description: '신칸센으로 오사카 이동 후 시내 관광',
      activities: ['신칸센 체험', '오사카성', '도톤보리', '구로몬 시장']
    },
    {
      day: 5,
      title: '오사카 → 인천',
      description: '마지막 쇼핑 후 귀국',
      activities: ['자유시간', '간사이공항 이동', '인천공항 도착']
    }
  ]

  const amenities = ['Wi-Fi', '에어컨', '전용 차량', '현지 가이드']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                뒤로가기
              </button>
              <h1 className="text-2xl font-bold text-gray-900">TripStore</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">안녕하세요, {user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => openAuthModal('login')}
                    className="text-gray-700 hover:text-primary-600"
                  >
                    로그인
                  </button>
                  <button 
                    onClick={() => openAuthModal('signup')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative mb-8">
              <img
                src={packageDetail.images[selectedImage] || '/placeholder.jpg'}
                alt={packageDetail.title}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                <Camera className="h-4 w-4 inline mr-1" />
                {selectedImage + 1} / {packageDetail.images.length || 1}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-600'} hover:bg-opacity-80`}
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 bg-white text-gray-600 rounded-full hover:bg-opacity-80">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Image Thumbnails */}
            <div className="flex gap-2 mb-8 overflow-x-auto">
              {packageDetail.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${packageDetail.title} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer ${
                    selectedImage === index ? 'ring-2 ring-primary-500' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>

            {/* Package Title and Rating */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{packageDetail.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{packageDetail.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{packageDetail.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-gray-600">{packageDetail.rating} ({packageDetail.reviews} 리뷰)</span>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">패키지 하이라이트</h3>
              <div className="grid grid-cols-2 gap-2">
                {packageDetail.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', label: '개요' },
                    { id: 'itinerary', label: '일정' },
                    { id: 'includes', label: '포함사항' },
                    { id: 'reviews', label: '리뷰' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === 'overview' && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{packageDetail.description}</p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-gray-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Wifi className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'itinerary' && (
                <div className="space-y-6">
                  {itinerary.map((day, index) => (
                    <div key={index} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-semibold text-lg text-gray-900">
                        {day.day}일차: {day.title}
                      </h4>
                      <p className="text-gray-600 mb-2">{day.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {day.activities.map((activity, actIndex) => (
                          <span
                            key={actIndex}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {activity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'includes' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-4">포함사항</h4>
                    <ul className="space-y-2">
                      {includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-4">불포함사항</h4>
                    <ul className="space-y-2">
                      {excludes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-700">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">리뷰 기능은 곧 출시될 예정입니다.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {packageDetail.price.toLocaleString()}원
                  </span>
                  <span className="text-gray-500 line-through">
                    {packageDetail.original_price.toLocaleString()}원
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                    {Math.round((1 - packageDetail.price / packageDetail.original_price) * 100)}% 할인
                  </span>
                  <span className="text-gray-600 text-sm">1인당 가격</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">출발일</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    기본 출발일: {new Date(packageDetail.departure_date).toLocaleDateString('ko-KR')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">여행자 수</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={1}>1명</option>
                      <option value={2}>2명</option>
                      <option value={3}>3명</option>
                      <option value={4}>4명</option>
                      <option value={5}>5명 이상</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">기본 금액</span>
                  <span className="font-medium">{(packageDetail.price * travelers).toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">할인 금액</span>
                  <span className="text-red-600 font-medium">
                    -{((packageDetail.original_price - packageDetail.price) * travelers).toLocaleString()}원
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">총 결제 금액</span>
                  <span className="text-xl font-bold text-primary-600">
                    {(packageDetail.price * travelers).toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                onClick={handleReservation}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors mb-4"
              >
                {user ? '예약하기' : '로그인 후 예약하기'}
              </button>

              <div className="text-center text-sm text-gray-500">
                <p>잔여석: {packageDetail.available_spots}석</p>
                <p className="mt-2">무료 취소 가능</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}
