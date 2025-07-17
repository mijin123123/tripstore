'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Package, TravelerDetail } from '@/types/database'
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  CreditCard, 
  Check,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

export default function BookingPage() {
  const { id } = useParams()
  const router = useRouter()
  const [pkg, setPkg] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [travelerCount, setTravelerCount] = useState(1)
  const [travelerDetails, setTravelerDetails] = useState<TravelerDetail[]>([])
  const [specialRequests, setSpecialRequests] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const steps = [
    { id: 1, title: '인원 선택', description: '여행 인원수를 선택해주세요' },
    { id: 2, title: '여행자 정보', description: '여행자 정보를 입력해주세요' },
    { id: 3, title: '예약 확인', description: '예약 정보를 확인해주세요' }
  ]

  useEffect(() => {
    if (id) {
      fetchPackageDetails()
    }
  }, [id])

  useEffect(() => {
    // Initialize traveler details when count changes
    const newTravelers: TravelerDetail[] = Array.from({ length: travelerCount }, (_, index) => ({
      name: '',
      email: '',
      phone: '',
      passport_number: '',
      birth_date: '',
      gender: 'male'
    }))
    setTravelerDetails(newTravelers)
  }, [travelerCount])

  const fetchPackageDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setPkg(data)
    } catch (error) {
      console.error('Error fetching package:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateStep1 = () => {
    if (!pkg) return false
    if (travelerCount < 1) {
      setErrors({ travelerCount: '최소 1명 이상 선택해주세요' })
      return false
    }
    if (travelerCount > (pkg.max_people - pkg.current_bookings)) {
      setErrors({ travelerCount: '잔여 인원을 초과했습니다' })
      return false
    }
    setErrors({})
    return true
  }

  const validateStep2 = () => {
    const newErrors: { [key: string]: string } = {}
    
    travelerDetails.forEach((traveler, index) => {
      if (!traveler.name.trim()) {
        newErrors[`name_${index}`] = '이름을 입력해주세요'
      }
      if (!traveler.email.trim()) {
        newErrors[`email_${index}`] = '이메일을 입력해주세요'
      } else if (!/\S+@\S+\.\S+/.test(traveler.email)) {
        newErrors[`email_${index}`] = '올바른 이메일 형식을 입력해주세요'
      }
      if (!traveler.phone.trim()) {
        newErrors[`phone_${index}`] = '전화번호를 입력해주세요'
      }
      if (!traveler.passport_number.trim()) {
        newErrors[`passport_${index}`] = '여권번호를 입력해주세요'
      }
      if (!traveler.birth_date) {
        newErrors[`birth_${index}`] = '생년월일을 입력해주세요'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateTravelerDetail = (index: number, field: keyof TravelerDetail, value: string) => {
    const updated = [...travelerDetails]
    updated[index] = { ...updated[index], [field]: value }
    setTravelerDetails(updated)
  }

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleBooking = async () => {
    if (!pkg) return

    setBookingLoading(true)
    try {
      // Get current user (in real app, this would come from auth)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to login or show login modal
        alert('로그인이 필요합니다')
        return
      }

      const bookingData = {
        user_id: user.id,
        package_id: pkg.id,
        traveler_count: travelerCount,
        total_price: pkg.price * travelerCount,
        traveler_details: travelerDetails,
        special_requests: specialRequests || null,
        status: 'pending' as const
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single()

      if (error) throw error

      // Update package current_bookings
      await supabase
        .from('packages')
        .update({ 
          current_bookings: pkg.current_bookings + travelerCount 
        })
        .eq('id', pkg.id)

      alert('예약이 완료되었습니다!')
      router.push(`/booking/success/${data.id}`)
      
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('예약 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">패키지를 찾을 수 없습니다</h1>
          <Link href="/packages" className="text-blue-600 hover:text-blue-700">
            패키지 목록으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/packages/${id}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            패키지 상세로 돌아가기
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">예약하기</h1>
          <h2 className="text-xl text-gray-600">{pkg.title}</h2>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1].title}
            </h3>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* Step 1: Traveler Count */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">여행 인원수 선택</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        여행자 수
                      </label>
                      <select
                        value={travelerCount}
                        onChange={(e) => setTravelerCount(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from({ length: pkg.max_people - pkg.current_bookings }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}명
                          </option>
                        ))}
                      </select>
                      {errors.travelerCount && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.travelerCount}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-800">
                          잔여 인원: {pkg.max_people - pkg.current_bookings}명
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Traveler Details */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">여행자 정보 입력</h3>
                  <div className="space-y-8">
                    {travelerDetails.map((traveler, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-4">
                          여행자 {index + 1}
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              이름 *
                            </label>
                            <input
                              type="text"
                              value={traveler.name}
                              onChange={(e) => updateTravelerDetail(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="홍길동"
                            />
                            {errors[`name_${index}`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`name_${index}`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              성별 *
                            </label>
                            <select
                              value={traveler.gender}
                              onChange={(e) => updateTravelerDetail(index, 'gender', e.target.value as 'male' | 'female')}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="male">남성</option>
                              <option value="female">여성</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              이메일 *
                            </label>
                            <input
                              type="email"
                              value={traveler.email}
                              onChange={(e) => updateTravelerDetail(index, 'email', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="hong@example.com"
                            />
                            {errors[`email_${index}`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`email_${index}`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              전화번호 *
                            </label>
                            <input
                              type="tel"
                              value={traveler.phone}
                              onChange={(e) => updateTravelerDetail(index, 'phone', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="010-1234-5678"
                            />
                            {errors[`phone_${index}`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`phone_${index}`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              여권번호 *
                            </label>
                            <input
                              type="text"
                              value={traveler.passport_number}
                              onChange={(e) => updateTravelerDetail(index, 'passport_number', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="M12345678"
                            />
                            {errors[`passport_${index}`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`passport_${index}`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              생년월일 *
                            </label>
                            <input
                              type="date"
                              value={traveler.birth_date}
                              onChange={(e) => updateTravelerDetail(index, 'birth_date', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[`birth_${index}`] && (
                              <p className="mt-1 text-sm text-red-600">{errors[`birth_${index}`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        특별 요청사항 (선택사항)
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="음식 알레르기, 휠체어 이용, 기타 요청사항 등을 입력해주세요"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Booking Confirmation */}
              {currentStep === 3 && (
                <div>
                  <h3 className="text-lg font-semibold mb-6">예약 정보 확인</h3>
                  <div className="space-y-6">
                    {/* Package Info */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">패키지 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">패키지명</span>
                          <span>{pkg.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">목적지</span>
                          <span>{pkg.destination}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">여행 기간</span>
                          <span>{pkg.duration}일</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">출발일</span>
                          <span>{new Date(pkg.departure_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Traveler Info */}
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">여행자 정보</h4>
                      <div className="space-y-3">
                        {travelerDetails.map((traveler, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">여행자 {index + 1}</div>
                            <div className="text-gray-600">
                              {traveler.name} ({traveler.gender === 'male' ? '남성' : '여성'}) - {traveler.email}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Special Requests */}
                    {specialRequests && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">특별 요청사항</h4>
                        <p className="text-sm text-gray-600">{specialRequests}</p>
                      </div>
                    )}

                    {/* Terms */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 mb-1">예약 전 확인사항</p>
                          <ul className="text-yellow-700 space-y-1">
                            <li>• 예약 확정 후 24시간 내 취소 시 수수료가 없습니다</li>
                            <li>• 출발 7일 전 취소 시 50% 수수료가 발생합니다</li>
                            <li>• 출발 3일 전 취소 시 100% 수수료가 발생합니다</li>
                            <li>• 여권 유효기간은 출발일 기준 6개월 이상이어야 합니다</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    다음
                  </button>
                ) : (
                  <button
                    onClick={handleBooking}
                    disabled={bookingLoading}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        예약 중...
                      </>
                    ) : (
                      '예약 완료'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">예약 요약</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">패키지 가격</span>
                  <span>₩{pkg.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">여행자 수</span>
                  <span>{travelerCount}명</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>총 금액</span>
                    <span className="text-blue-600">₩{(pkg.price * travelerCount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  <span>결제는 예약 확정 후 별도 안내</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
