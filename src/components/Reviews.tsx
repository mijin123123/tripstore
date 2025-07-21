'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface Review {
  id: string
  name: string
  rating: number
  date: string
  title: string
  comment: string
  destination: string
  tripType: string
}

const Reviews = () => {
  const [startIndex, setStartIndex] = useState(0)
  
  const reviews: Review[] = [
    {
      id: '1',
      name: '김민지',
      rating: 5,
      date: '2025년 6월',
      title: '환상적인 파리 여행이었어요!',
      comment: '이번 파리 여행은 정말 특별했습니다. 가이드분이 너무 친절하시고 전문적이었으며, 여행 일정도 완벽했어요.',
      destination: '프랑스 파리',
      tripType: '패키지 여행'
    },
    {
      id: '2',
      name: '이준호',
      rating: 4,
      date: '2025년 5월',
      title: '일본 벚꽃 시즌에 딱 맞춘 도쿄 여행',
      comment: '도쿄 벚꽃 시즌에 맞춰 여행을 갔는데, 정말 아름다웠어요. 호텔도 깨끗하고 직원들도 친절했습니다.',
      destination: '일본 도쿄',
      tripType: '자유 여행'
    },
    {
      id: '3',
      name: '박서연',
      rating: 5,
      date: '2025년 7월',
      title: '가족과 함께한 로마 여행',
      comment: '아이들과 함께 로마 여행을 다녀왔습니다. 특히 콜로세움 VIP 투어와 피자 만들기 체험은 아이들이 가장 좋아했습니다.',
      destination: '이탈리아 로마',
      tripType: '가족 여행'
    },
    {
      id: '4',
      name: '정현우',
      rating: 4,
      date: '2025년 4월',
      title: '스페인 바르셀로나 여행',
      comment: '사그라다 파밀리아와 가우디 건축물들이 정말 인상적이었습니다. 현지 음식도 맛있고 날씨도 좋아서 즐거운 여행이었습니다.',
      destination: '스페인 바르셀로나',
      tripType: '커플 여행'
    },
    {
      id: '5',
      name: '최예린',
      rating: 5,
      date: '2025년 3월',
      title: '베트남 다낭 휴양 여행',
      comment: '리조트 시설이 깨끗하고 바다가 정말 예뻤어요. 호이안 구시가지 투어와 바나힐 방문도 좋은 경험이었습니다.',
      destination: '베트남 다낭',
      tripType: '휴양 여행'
    },
    {
      id: '6',
      name: '김태우',
      rating: 4,
      date: '2025년 5월',
      title: '싱가포르 가족 여행',
      comment: '아이들과 함께한 싱가포르 여행, 유니버설 스튜디오와 마리나베이샌즈 수영장이 특히 기억에 남습니다.',
      destination: '싱가포르',
      tripType: '가족 여행'
    },
    {
      id: '7',
      name: '이지민',
      rating: 5,
      date: '2025년 2월',
      title: '괌 신혼여행',
      comment: '투몬비치와 리티디안 비치의 투명한 바다가 정말 아름다웠어요. 선셋 크루즈도 로맨틱했습니다.',
      destination: '괌',
      tripType: '신혼 여행'
    }
  ]

  const handlePrev = () => {
    setStartIndex((prev) => 
      prev === 0 ? Math.max(0, reviews.length - 5) : Math.max(0, prev - 5)
    )
  }

  const handleNext = () => {
    setStartIndex((prev) =>
      prev + 5 >= reviews.length ? 0 : prev + 5
    )
  }

  // 현재 보이는 리뷰 5개 (또는 남은 리뷰)
  const visibleReviews = reviews.slice(startIndex, Math.min(startIndex + 5, reviews.length));

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            고객 리뷰
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            실제 여행을 경험한 고객님들의 솔직한 후기를 확인해보세요
          </p>
        </div>

        {/* Reviews Row */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {visibleReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="mb-3">
                  <h4 className="font-bold text-lg">{review.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">• {review.date}</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold mb-2">{review.title}</h3>
                <p className="text-xs text-gray-600 mb-4 line-clamp-3">"{review.comment}"</p>

                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {review.destination}
                  </span>
                  <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                    {review.tripType}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 5 && (
            <>
              {/* Navigation Buttons */}
              <button 
                onClick={handlePrev}
                className="absolute top-1/2 -translate-y-1/2 -left-5 md:-left-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <button 
                onClick={handleNext}
                className="absolute top-1/2 -translate-y-1/2 -right-5 md:-right-10 w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {reviews.length > 5 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(reviews.length / 5) }).map((_, index) => (
              <button 
                key={index} 
                onClick={() => setStartIndex(index * 5)}
                className={`w-2 h-2 rounded-full ${startIndex / 5 === index ? 'bg-blue-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Reviews
