'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { User, CalendarDays, CreditCard, MapPin, Heart, LogOut, Edit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'bookings', 'wishlist'
  const [bookings, setBookings] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
        let currentUser = null
        
        // 로그인 상태 확인 (임시로 비활성화)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // 세션이 없어도 임시 사용자로 진행
        if (!session) {
          console.log('세션이 없음: 임시 사용자로 진행')
          currentUser = { 
            id: 'temp-user',
            email: 'admin@tripstore.com',
            name: 'admin',
            created_at: new Date().toISOString()
          }
        } else {
          // 실제 사용자 정보 가져오기
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (userError || !userData) {
            console.error('사용자 데이터 가져오기 오류:', userError)
            currentUser = { 
              id: session.user.id,
              email: session.user.email,
              name: '사용자',
              created_at: session.user.created_at
            }
          } else {
            currentUser = userData
          }
        }
        
        setUser(currentUser)
        
        // 예약 정보 가져오기 - 사용자별 조회
        try {
          const userId = currentUser?.id || 'temp-user';
          const response = await fetch(`/api/bookings?userId=${userId}`);
          if (response.ok) {
            const result = await response.json();
            console.log('API로 가져온 예약 데이터:', result);
            setBookings(result.bookings || []);
          } else {
            console.error('예약 API 오류:', response.status);
            setBookings([]);
          }
        } catch (error) {
          console.error('예약 데이터 가져오기 실패:', error);
          setBookings([]);
        }
        
        // 위시리스트 정보 가져오기 (임시로 비활성화)
        // const { data: wishlistData, error: wishlistError } = await supabase
        //   .from('wishlists')
        //   .select(`
        //     *,
        //     packages (id, title, image_url, price, destination),
        //     hotels (id, name, image_url, price_per_night, location),
        //     villas (id, name, image_url, price_per_night, location)
        //   `)
        //   .eq('user_id', session?.user?.id)
        
        // if (wishlistError) {
        //   console.error('위시리스트 데이터 가져오기 오류:', wishlistError)
        // } else {
        //   setWishlist(wishlistData || [])
        // }
        setWishlist([])
      } catch (error) {
        console.error('사용자 데이터 가져오기 중 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
  }, [router])
  
  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '확정'
      case 'pending':
        return '대기중'
      case 'cancelled':
        return '취소됨'
      case 'completed':
        return '완료'
      default:
        return status
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 사이드바 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold">{user?.name || '사용자'}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                
                {user?.is_admin && (
                  <Link 
                    href="/admin" 
                    className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    관리자 페이지
                  </Link>
                )}
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>내 정보</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'bookings' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <CalendarDays className="h-5 w-5 mr-3" />
                  <span>예약 내역</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`flex items-center w-full px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'wishlist' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  <span>위시리스트</span>
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>로그아웃</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="md:col-span-3">
            {/* 프로필 탭 */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">내 정보</h1>
                  <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4 mr-1" />
                    프로필 수정
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">이름</h3>
                    <p className="text-lg">{user?.name || '이름 정보 없음'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">이메일</h3>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">전화번호</h3>
                    <p className="text-lg">{user?.phone || '전화번호 정보 없음'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">주소</h3>
                    <p className="text-lg">{user?.address || '주소 정보 없음'}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">가입일</h3>
                    <p className="text-lg">{new Date(user?.created_at).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-medium mb-2">비밀번호 변경</h3>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      비밀번호 변경하기
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* 예약 내역 탭 */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-6">예약 내역</h1>
                
                {bookings.length > 0 ? (
                  <div className="space-y-6">
                    {bookings.map((booking) => {
                      // 예약 종류에 따라 데이터 결정
                      const item = booking.packages || booking.hotels || booking.villas
                      const itemType = booking.packages ? '패키지' : booking.hotels ? '호텔' : '빌라'
                      const title = item?.title || item?.name || '이름 정보 없음'
                      const imageUrl = item?.image_url || '/images/placeholder.jpg'
                      const price = item?.price || item?.price_per_night || 0
                      
                      return (
                        <div key={booking.id} className="border rounded-lg overflow-hidden">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/3 relative h-48 sm:h-auto">
                              <Image
                                src={imageUrl}
                                alt={title}
                                className="object-cover"
                                fill
                              />
                            </div>
                            <div className="sm:w-2/3 p-4 sm:p-6">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="text-xs font-medium text-gray-500">{itemType}</span>
                                  <h2 className="text-xl font-bold">{title}</h2>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)}`}>
                                  {getStatusText(booking.status)}
                                </span>
                              </div>
                              
                              <div className="mb-4">
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                  <CalendarDays className="h-4 w-4 mr-2" />
                                  {new Date(booking.check_in_date).toLocaleDateString()} ~ {new Date(booking.check_out_date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {booking.destination || item?.location || '장소 정보 없음'}
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="text-sm text-gray-500">예약일</span>
                                  <p className="text-sm">{new Date(booking.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-sm text-gray-500">금액</span>
                                  <p className="text-lg font-bold">₩{(booking.total_price || price).toLocaleString()}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                                <Link
                                  href={`/booking/${booking.id}`}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                                >
                                  상세보기
                                </Link>
                                {booking.status === 'pending' && (
                                  <button className="px-4 py-2 border border-red-600 text-red-600 text-sm rounded-md hover:bg-red-50 transition-colors">
                                    취소하기
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CalendarDays className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">예약 내역이 없습니다</h3>
                    <p className="text-gray-500 mb-6">아직 예약한 여행이 없습니다. 지금 여행을 계획해보세요!</p>
                    <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      여행 둘러보기
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* 위시리스트 탭 */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-6">위시리스트</h1>
                
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlist.map((item) => {
                      const wishItem = item.packages || item.hotels || item.villas
                      const itemType = item.packages ? '패키지' : item.hotels ? '호텔' : '빌라'
                      const title = wishItem?.title || wishItem?.name || '이름 정보 없음'
                      const imageUrl = wishItem?.image_url || '/images/placeholder.jpg'
                      const price = wishItem?.price || wishItem?.price_per_night || 0
                      const itemUrl = item.packages 
                        ? `/package/${item.package_id}` 
                        : item.hotels 
                          ? `/hotel/${item.hotel_id}` 
                          : `/villa/${item.villa_id}`
                      
                      return (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <div className="relative h-48">
                            <Image
                              src={imageUrl}
                              alt={title}
                              className="object-cover"
                              fill
                            />
                            <button className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow-md hover:bg-red-50">
                              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            </button>
                          </div>
                          <div className="p-4">
                            <span className="text-xs font-medium text-gray-500">{itemType}</span>
                            <h3 className="text-lg font-bold mb-2 line-clamp-1">{title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-3">
                              <MapPin className="h-4 w-4 mr-2" />
                              {wishItem?.destination || wishItem?.location || '장소 정보 없음'}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-bold">₩{price.toLocaleString()}</p>
                              <Link 
                                href={itemUrl}
                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                              >
                                상세보기
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">위시리스트가 비어있습니다</h3>
                    <p className="text-gray-500 mb-6">마음에 드는 상품을 위시리스트에 추가해보세요!</p>
                    <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      여행 둘러보기
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
