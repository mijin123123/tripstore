'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Users, Clock, CheckCircle, XCircle, Star, Heart, Share2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'

type Package = Database['public']['Tables']['packages']['Row']

export default function PackageDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [packageData, setPackageData] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)

  useEffect(() => {
    async function fetchPackage() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single()

        if (error) {
          throw error
        }

        setPackageData(data)
      } catch (error) {
        console.error('패키지 정보를 불러오는 중 오류 발생:', error)
        setError('패키지 정보를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPackage()
    }
  }, [id])

  const handleBooking = () => {
    if (!selectedDate) {
      alert('출발일을 선택해주세요.')
      return
    }
    router.push(`/booking/${id}?date=${selectedDate}&guests=${guestCount}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-6"></div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link 
              href="/packages"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              패키지 목록으로 돌아가기
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">패키지를 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-6">{error || '요청하신 패키지가 존재하지 않거나 삭제되었습니다.'}</p>
            <Link 
              href="/packages"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              패키지 목록 보기
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Link 
            href="/packages"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            패키지 목록으로 돌아가기
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            {/* 이미지 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <img 
                src={packageData.image_url || '/placeholder-image.jpg'} 
                alt={packageData.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* 패키지 정보 */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{packageData.title}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{packageData.destination}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{packageData.duration}일</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {packageData.description}
              </p>

              {/* 여행 일정 */}
              {packageData.schedule && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">여행 일정</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {packageData.schedule}
                    </pre>
                  </div>
                </div>
              )}

              {/* 포함 사항 */}
              {packageData.includes && packageData.includes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">포함 사항</h3>
                  <ul className="space-y-2">
                    {packageData.includes.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 불포함 사항 */}
              {packageData.excludes && packageData.excludes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">불포함 사항</h3>
                  <ul className="space-y-2">
                    {packageData.excludes.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 예약 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    {packageData.price?.toLocaleString()}원
                  </span>
                  <span className="text-gray-600 ml-2">/ 인</span>
                </div>
                {packageData.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {packageData.rating} (후기 {packageData.review_count || 0}개)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {/* 출발일 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    출발일
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* 인원 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    인원
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}명
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 총 금액 */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">총 금액</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {((packageData.price || 0) * guestCount).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 예약 버튼 */}
              <button
                onClick={handleBooking}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4"
              >
                예약하기
              </button>

              {/* 여행 정보 */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>여행 기간</span>
                  <span>{packageData.duration}일</span>
                </div>
                {packageData.start_date && (
                  <div className="flex items-center justify-between">
                    <span>출발일</span>
                    <span>{new Date(packageData.start_date).toLocaleDateString()}</span>
                  </div>
                )}
                {packageData.end_date && (
                  <div className="flex items-center justify-between">
                    <span>도착일</span>
                    <span>{new Date(packageData.end_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>최대 인원</span>
                  <span>{packageData.max_participants}명</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>현재 예약</span>
                  <span>{packageData.current_participants || 0}명</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
