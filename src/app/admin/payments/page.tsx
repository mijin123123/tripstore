'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, CheckCircle, XCircle, AlertCircle, Info, Eye } from 'lucide-react'
import Link from 'next/link'
import { Database } from '@/types/database.types'

type PaymentWithRelations = Database['public']['Tables']['payments']['Row'] & {
  bookings?: (Database['public']['Tables']['bookings']['Row'] & {
    users?: {
      name: string | null
      email: string
    }
    packages?: {
      name: string
    } | null
    villas?: {
      name: string
    } | null
  }) | null
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<PaymentWithRelations[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<PaymentWithRelations | null>(null)
  
  useEffect(() => {
    fetchPayments()
  }, [])
  
  const fetchPayments = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            *,
            users (name, email),
            packages (name),
            villas (name)
          )
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setPayments(data as any || [])
    } catch (error) {
      console.error('결제 데이터를 가져오는 데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // 결제 상태 업데이트
  const updatePaymentStatus = async (id: string, status: string) => {
    if (!confirm(`결제 상태를 '${status}'로 변경하시겠습니까?`)) {
      return
    }
    
    try {
      const supabase = createClient()
      
      // 결제 상태 업데이트
      const { error } = await supabase
        .from('payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
      
      if (error) throw error
      
      // 환불 처리 시 예약 상태도 변경
      if (status === 'refunded') {
        const payment = payments.find(p => p.id === id)
        if (payment && payment.booking_id) {
          await supabase
            .from('bookings')
            .update({ status: 'cancelled' })
            .eq('id', payment.booking_id)
        }
      }
      
      fetchPayments()
    } catch (error) {
      console.error('결제 상태 업데이트에 실패했습니다:', error)
    }
  }
  
  // 결제 정보 상세 보기
  const viewPaymentDetail = (payment: PaymentWithRelations) => {
    setCurrentPayment(payment)
    setShowDetailModal(true)
  }
  
  // 결제일 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  
  // 결제 상태 표시
  const renderStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            완료
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-4 w-4 mr-1" />
            대기중
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-4 w-4 mr-1" />
            실패
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Info className="h-4 w-4 mr-1" />
            환불됨
          </span>
        )
      default:
        return status
    }
  }
  
  // 결제 종류 확인 (패키지, 호텔, 빌라)
  const getBookingType = (payment: PaymentWithRelations) => {
    if (!payment.bookings) return '알 수 없음'
    
    if (payment.bookings.package_id) {
      return '패키지'
    } else if (payment.bookings.villa_id) {
      return '빌라'
    }
    
    return '알 수 없음'
  }
  
  // 결제 항목 이름 가져오기
  const getBookingItemName = (payment: PaymentWithRelations) => {
    if (!payment.bookings) return '-'
    
    if (payment.bookings.packages) {
      return payment.bookings.packages.name
    } else if (payment.bookings.villas) {
      return payment.bookings.villas.name
    }
    
    return '-'
  }
  
  // 결제 금액 포맷팅
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
  }
  
  // 필터링된 결제 목록
  const filteredPayments = payments.filter(payment => {
    // 상태 필터링
    if (statusFilter !== 'all' && payment.status !== statusFilter) {
      return false
    }
    
    // 검색어 필터링
    const bookingItem = getBookingItemName(payment)
    const userName = payment.bookings?.users?.name || ''
    const userEmail = payment.bookings?.users?.email || ''
    const paymentId = payment.id || ''
    const bookingId = payment.booking_id || ''
    
    return (
      bookingItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paymentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookingId.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })
  
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">결제 관리</h1>
      </div>
      
      {/* 검색 및 필터링 */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="이름, 이메일, 상품명, ID로 검색..."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 md:w-48"
        >
          <option value="all">모든 상태</option>
          <option value="completed">완료</option>
          <option value="pending">대기중</option>
          <option value="failed">실패</option>
          <option value="refunded">환불됨</option>
        </select>
      </div>
      
      {/* 결제 목록 */}
      {filteredPayments.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">결제 ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">예약자</th>
                  <th className="px-6 py-3 font-medium text-gray-500">유형</th>
                  <th className="px-6 py-3 font-medium text-gray-500">상품명</th>
                  <th className="px-6 py-3 font-medium text-gray-500">결제 방식</th>
                  <th className="px-6 py-3 font-medium text-gray-500">금액</th>
                  <th className="px-6 py-3 font-medium text-gray-500">결제일</th>
                  <th className="px-6 py-3 font-medium text-gray-500">상태</th>
                  <th className="px-6 py-3 font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{payment.id}</td>
                    <td className="px-6 py-4">
                      {payment.bookings?.users ? (
                        <div>
                          <div className="font-medium">{payment.bookings.users.name}</div>
                          <div className="text-sm text-gray-500">{payment.bookings.users.email}</div>
                        </div>
                      ) : (
                        '알 수 없음'
                      )}
                    </td>
                    <td className="px-6 py-4">{getBookingType(payment)}</td>
                    <td className="px-6 py-4">{getBookingItemName(payment)}</td>
                    <td className="px-6 py-4">{payment.payment_method}</td>
                    <td className="px-6 py-4 font-medium">{formatAmount(payment.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(payment.created_at)}</td>
                    <td className="px-6 py-4">{renderStatus(payment.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => viewPaymentDetail(payment)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="상세 보기"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => updatePaymentStatus(payment.id, 'completed')}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="승인"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        
                        {payment.status === 'completed' && (
                          <button 
                            onClick={() => updatePaymentStatus(payment.id, 'refunded')}
                            className="p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                            title="환불"
                          >
                            <Info className="h-5 w-5" />
                          </button>
                        )}
                        
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => updatePaymentStatus(payment.id, 'failed')}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="실패"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          {searchQuery || statusFilter !== 'all' ? (
            <>
              <p className="text-xl font-medium mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
            </>
          ) : (
            <>
              <p className="text-xl font-medium mb-2">결제 내역이 없습니다</p>
              <p className="text-gray-500 mb-4">아직 결제 데이터가 없습니다.</p>
            </>
          )}
        </div>
      )}
      
      {/* 결제 상세 모달 */}
      {showDetailModal && currentPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">결제 상세 정보</h2>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-4">결제 정보</h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">결제 ID</dt>
                    <dd className="font-mono">{currentPayment.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">결제 금액</dt>
                    <dd className="font-medium">{formatAmount(currentPayment.amount)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">결제 상태</dt>
                    <dd>{renderStatus(currentPayment.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">결제 방식</dt>
                    <dd>{currentPayment.payment_method}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">결제일</dt>
                    <dd>{formatDate(currentPayment.created_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">최종 수정일</dt>
                    <dd>{formatDate(currentPayment.updated_at)}</dd>
                  </div>
                  {currentPayment.transaction_id && (
                    <div>
                      <dt className="text-sm text-gray-500">거래 ID</dt>
                      <dd className="font-mono">{currentPayment.transaction_id}</dd>
                    </div>
                  )}
                </dl>
              </div>
              
              {currentPayment.bookings && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">예약 정보</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">예약 ID</dt>
                      <dd className="font-mono">{currentPayment.bookings.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">예약 유형</dt>
                      <dd>{getBookingType(currentPayment)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">상품명</dt>
                      <dd>{getBookingItemName(currentPayment)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">예약 상태</dt>
                      <dd>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${currentPayment.bookings.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          currentPayment.bookings.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          currentPayment.bookings.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                          {currentPayment.bookings.status === 'confirmed' ? '확정' :
                           currentPayment.bookings.status === 'pending' ? '대기중' :
                           currentPayment.bookings.status === 'cancelled' ? '취소됨' :
                           currentPayment.bookings.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">체크인</dt>
                      <dd>{currentPayment.bookings.start_date ? new Date(currentPayment.bookings.start_date).toLocaleDateString() : '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">체크아웃</dt>
                      <dd>{currentPayment.bookings.end_date ? new Date(currentPayment.bookings.end_date).toLocaleDateString() : '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">예약일</dt>
                      <dd>{formatDate(currentPayment.bookings.created_at)}</dd>
                    </div>
                  </dl>
                </div>
              )}
              
              {currentPayment.bookings?.users && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">고객 정보</h3>
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">이름</dt>
                      <dd>{currentPayment.bookings.users.name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">이메일</dt>
                      <dd>{currentPayment.bookings.users.email}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-sm text-gray-500">사용자 관리</dt>
                      <dd className="mt-1">
                        <Link
                          href={`/admin/users?search=${encodeURIComponent(currentPayment.bookings.users.email)}`}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md text-sm transition-colors"
                        >
                          사용자 정보 보기
                        </Link>
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  닫기
                </button>
                
                {currentPayment.status === 'pending' && (
                  <button
                    onClick={() => {
                      updatePaymentStatus(currentPayment.id, 'completed')
                      setShowDetailModal(false)
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    결제 승인
                  </button>
                )}
                
                {currentPayment.status === 'completed' && (
                  <button
                    onClick={() => {
                      updatePaymentStatus(currentPayment.id, 'refunded')
                      setShowDetailModal(false)
                    }}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors flex items-center"
                  >
                    <Info className="h-5 w-5 mr-2" />
                    환불 처리
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
