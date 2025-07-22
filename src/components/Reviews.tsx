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
  
  // 빈 리뷰 배열 - 실제 데이터는 API에서 가져옵니다
  const reviews: Review[] = []

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
          {reviews.length > 0 ? (
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
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-500">아직 등록된 리뷰가 없습니다.</p>
              <p className="text-gray-500 mt-2">여행을 다녀오신 후 첫 번째 리뷰를 작성해 주세요!</p>
            </div>
          )}
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
