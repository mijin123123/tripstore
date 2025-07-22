'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Edit, Trash2, Star } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: number
  user_id: string
  package_id: string | null
  rating: number
  comment: string | null
  created_at: string
  user_name: string
  package_title: string
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users:user_id (name, email),
          packages:package_id (title)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const formattedReviews = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        package_id: item.package_id,
        rating: item.rating,
        comment: item.comment,
        created_at: new Date(item.created_at).toLocaleDateString('ko-KR'),
        user_name: item.users?.name || '알 수 없음',
        package_title: item.packages?.title || '삭제된 패키지'
      })) || []
      
      setReviews(formattedReviews)
      
    } catch (error: any) {
      console.error('리뷰 데이터를 불러오는 중 오류가 발생했습니다:', error.message)
      setError('리뷰 데이터를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])
  
  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return
    
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
      
      if (error) throw error
      
      // 삭제 후 리뷰 목록 새로고침
      fetchReviews()
      
    } catch (error: any) {
      console.error('리뷰 삭제 중 오류가 발생했습니다:', error.message)
      setError('리뷰 삭제에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredReviews = reviews

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index} 
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">리뷰 관리</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">표시할 리뷰가 없습니다</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      사용자
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      패키지
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      평점
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      리뷰내용
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      날짜
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map((review) => (
                    <tr key={review.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{review.user_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{review.package_title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(review.rating)}
                          <span className="ml-1 text-sm text-gray-600">({review.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {review.comment}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{review.created_at}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
