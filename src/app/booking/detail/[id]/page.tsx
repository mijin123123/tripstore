'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  User,
  CalendarDays,
  DollarSign,
  MessageCircle
} from 'lucide-react'

// 예약 정보 타입 정의
interface BookingDetail {
  id: string
  user_id: string | null
  package_id: string
  villa_id: string | null
  booking_date: string
  start_date: string | null
  end_date: string | null
  people_count: number
  total_price: number
  status: string
  payment_status: string
  special_requests: string | null
  created_at: string
  updated_at: string
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  // 예약자 정보를 파싱하는 함수
  const parseBookingInfo = (specialRequests: string | null) => {
    try {
      if (!specialRequests) return null
      
      const parsed = JSON.parse(specialRequests)
      return {
        travelerInfo: parsed.travelerInfo || null,
        specialRequests: parsed.specialRequests || '',
        allTravelers: parsed.allTravelers || []
      }
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    const fetchBookingDetail = async () => {
      if (!params.id) return

      try {
        setIsLoading(true)
        console.log('예약 상세 정보 조회:', params.id)

        // 모든 예약을 가져와서 해당 ID 찾기
        const response = await fetch('/api/bookings')
        if (!response.ok) {
          throw new Error('예약 정보를 불러오는데 실패했습니다.')
        }

        const result = await response.json()
        const bookingDetail = result.bookings?.find((b: any) => b.id.toString() === params.id.toString())
        
        if (!bookingDetail) {
          throw new Error('예약 정보를 찾을 수 없습니다.')
        }

        setBooking(bookingDetail)
      } catch (error) {
        console.error('예약 상세 정보 조회 오류:', error)
        setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingDetail()
  }, [params.id])

  // 예약 취소 함수
  const handleCancelBooking = async () => {
    if (!booking) return
    
    setIsCancelling(true)
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      })

      if (!response.ok) {
        throw new Error('예약 취소에 실패했습니다.')
      }

      // 예약 상태 업데이트
      setBooking({
        ...booking,
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })

      setShowCancelModal(false)
      alert('예약이 성공적으로 취소되었습니다.')
      
    } catch (error) {
      console.error('예약 취소 오류:', error)
      alert('예약 취소 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsCancelling(false)
    }
  }

  // 상태 표시 컴포넌트
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'confirmed': 
          return { 
            color: 'bg-green-100 text-green-800 border-green-200', 
            icon: CheckCircle, 
            text: '예약 확정' 
          }
        case 'pending': 
          return { 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
            icon: Clock, 
            text: '예약 대기' 
          }
        case 'cancelled': 
          return { 
            color: 'bg-red-100 text-red-800 border-red-200', 
            icon: XCircle, 
            text: '예약 취소' 
          }
        case 'completed': 
          return { 
            color: 'bg-blue-100 text-blue-800 border-blue-200', 
            icon: CheckCircle, 
            text: '여행 완료' 
          }
        default: 
          return { 
            color: 'bg-gray-100 text-gray-800 border-gray-200', 
            icon: AlertCircle, 
            text: status 
          }
      }
    }

    const { color, icon: Icon, text } = getStatusInfo(status)

    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${color}`}>
        <Icon className="h-4 w-4 mr-2" />
        {text}
      </div>
    )
  }

  // 결제 상태 표시 컴포넌트
  const PaymentStatusBadge = ({ status }: { status: string }) => {
    const getPaymentInfo = (status: string) => {
      switch (status) {
        case 'paid': 
          return { 
            color: 'bg-green-100 text-green-800 border-green-200', 
            icon: CheckCircle, 
            text: '결제 완료' 
          }
        case 'unpaid': 
          return { 
            color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
            icon: Clock, 
            text: '결제 대기' 
          }
        case 'refunded': 
          return { 
            color: 'bg-blue-100 text-blue-800 border-blue-200', 
            icon: ArrowLeft, 
            text: '환불 완료' 
          }
        case 'failed': 
          return { 
            color: 'bg-red-100 text-red-800 border-red-200', 
            icon: XCircle, 
            text: '결제 실패' 
          }
        default: 
          return { 
            color: 'bg-gray-100 text-gray-800 border-gray-200', 
            icon: AlertCircle, 
            text: status 
          }
      }
    }

    const { color, icon: Icon, text } = getPaymentInfo(status)

    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${color}`}>
        <Icon className="h-4 w-4 mr-2" />
        {text}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/profile"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              돌아가기
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
            <p className="text-gray-600 mb-6">{error || '예약 정보를 불러올 수 없습니다.'}</p>
            <Link
              href="/profile"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              프로필로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            예약 내역으로 돌아가기
          </Link>
        </div>

        {/* 예약 상세 정보 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* 헤더 섹션 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">예약 상세 정보</h1>
                <p className="text-blue-100">예약 번호: #{booking.id}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <StatusBadge status={booking.status} />
                <PaymentStatusBadge status={booking.payment_status} />
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 예약 정보 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
                    예약 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">패키지 ID</span>
                      <span className="font-medium">{booking.package_id}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">출발일</span>
                      <span className="font-medium">
                        {booking.start_date 
                          ? new Date(booking.start_date).toLocaleDateString('ko-KR')
                          : '미정'
                        }
                      </span>
                    </div>
                    {booking.end_date && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">도착일</span>
                        <span className="font-medium">
                          {new Date(booking.end_date).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">인원수</span>
                      <span className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {booking.people_count}명
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">예약일</span>
                      <span className="font-medium">
                        {new Date(booking.booking_date || booking.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>

                {(() => {
                  const bookingInfo = parseBookingInfo(booking.special_requests)
                  
                  return (
                    <>
                      {/* 예약자 정보 */}
                      {bookingInfo?.travelerInfo && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <User className="h-5 w-5 mr-2 text-blue-600" />
                            예약자 정보
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">이름</span>
                              <span className="font-medium">{bookingInfo.travelerInfo.name || '알 수 없음'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">이메일</span>
                              <span className="font-medium flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {bookingInfo.travelerInfo.email || '알 수 없음'}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">전화번호</span>
                              <span className="font-medium flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {bookingInfo.travelerInfo.phone || '알 수 없음'}
                              </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                              <span className="text-gray-600">생년월일</span>
                              <span className="font-medium">{bookingInfo.travelerInfo.birthdate || '알 수 없음'}</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="text-gray-600">성별</span>
                              <span className="font-medium">{bookingInfo.travelerInfo.gender || '알 수 없음'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 특별 요청사항 */}
                      {bookingInfo?.specialRequests && bookingInfo.specialRequests.trim() !== '' && (
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                            특별 요청사항
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{bookingInfo.specialRequests}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>

              {/* 결제 정보 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
                    결제 정보
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 금액</span>
                      <span className="text-2xl font-bold text-gray-900">
                        ₩{booking.total_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 상태</span>
                      <PaymentStatusBadge status={booking.payment_status} />
                    </div>
                  </div>
                </div>

                {/* 예약 상태 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    예약 상태
                  </h3>
                  <div className="space-y-3">
                    <StatusBadge status={booking.status} />
                    <div className="text-sm text-gray-600">
                      <p>마지막 업데이트: {new Date(booking.updated_at).toLocaleString('ko-KR')}</p>
                    </div>
                  </div>
                </div>

                {/* 고객 지원 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                    고객 지원
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      1:1 채팅문의
                    </button>
                    <div className="flex items-center text-sm text-blue-700 justify-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>이메일: support@tripstore.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                {booking.status === 'pending' && booking.payment_status === 'unpaid' && (
                  <button 
                    onClick={() => setShowPaymentInfo(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    결제하기
                  </button>
                )}
                {booking.status === 'pending' && (
                  <button 
                    onClick={() => setShowCancelModal(true)}
                    className="px-6 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    예약 취소
                  </button>
                )}
                <Link
                  href="/profile"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  목록으로 돌아가기
                </Link>
              </div>
            </div>

            {/* 계좌정보 모달 */}
            {showPaymentInfo && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">계좌 이체 정보</h3>
                    <button 
                      onClick={() => setShowPaymentInfo(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">은행명</span>
                          <span className="font-medium">국민은행</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">계좌번호</span>
                          <span className="font-medium">123-456-789012</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">예금주</span>
                          <span className="font-medium">㈜트립스토어</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">입금액</span>
                          <span className="font-bold text-blue-600">₩{booking.total_price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">입금 시 주의사항</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 예약번호 #{booking.id}를 입금자명에 포함해 주세요</li>
                        <li>• 정확한 금액을 입금해 주세요</li>
                        <li>• 입금 후 1:1 채팅문의로 연락 부탁드립니다</li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowPaymentInfo(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        닫기
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText('123-456-789012')
                          alert('계좌번호가 복사되었습니다.')
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        계좌번호 복사
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 예약 취소 확인 모달 */}
            {showCancelModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-red-600">예약 취소 확인</h3>
                    <button 
                      onClick={() => setShowCancelModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                      disabled={isCancelling}
                    >
                      <XCircle className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-red-800 mb-2">예약을 취소하시겠습니까?</h4>
                          <p className="text-sm text-red-700">
                            예약번호 #{booking.id}을 취소하면 되돌릴 수 없습니다.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">취소 시 주의사항</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 취소 후에는 예약을 복구할 수 없습니다</li>
                        <li>• 결제가 완료된 경우 환불 처리가 진행됩니다</li>
                        <li>• 환불 문의는 고객센터로 연락 부탁드립니다</li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setShowCancelModal(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        disabled={isCancelling}
                      >
                        돌아가기
                      </button>
                      <button 
                        onClick={handleCancelBooking}
                        disabled={isCancelling}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                      >
                        {isCancelling ? '취소 중...' : '예약 취소'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
