"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Search, ArrowLeft, Filter } from "lucide-react";

// 확장된 리뷰 데이터
const reviewsData = [
  {
    id: 1,
    name: "고객1",
    package: "스위스 알프스 7일 완벽 일주",
    packageId: 1,
    rating: 5,
    comment: "꿈에 그리던 스위스 융프라우에 다녀왔습니다. 가이드님도 너무 친절하셨고, 일정도 여유있게 진행되어 정말 좋았어요. 특히 호텔이 모두 4성급 이상으로 쾌적했습니다. 스위스 알프스의 경치는 말로 표현할 수 없을 정도로 아름다웠고, 현지 음식도 맛있었습니다. 다음에 기회가 된다면 또 이용하고 싶어요.",
    date: "2025년 6월 15일"
  },
  {
    id: 2,
    name: "고객2",
    package: "파리 5일",
    packageId: 2,
    rating: 4,
    comment: "파리 여행은 처음이었는데, 정말 로맨틱한 도시더라구요! 에펠탑, 루브르 박물관, 몽마르뜨 모두 좋았습니다. 다만 일정이 조금 빡빡한 점이 아쉬웠어요. 호텔 위치는 시내 중심에 있어서 교통이 편리했고, 가이드의 설명이 자세해서 파리의 역사와 문화를 이해하는 데 많은 도움이 되었습니다.",
    date: "2025년 5월 22일"
  },
  {
    id: 3,
    name: "고객3",
    package: "발리 꿈의 휴양 6일",
    packageId: 4,
    rating: 5,
    comment: "정말 완벽한 휴식이었습니다. 발리 리조트는 사진보다 더 멋졌고, 스파와 마사지 서비스도 만족스러웠어요. TripStore를 통해 예약해서 큰 할인도 받았습니다! 특히 우붓의 원숭이 숲과 발리 전통 댄스 공연이 인상적이었고, 리조트의 인피니티 풀은 정말 환상적이었습니다. 친구들에게도 적극 추천하고 싶은 여행입니다.",
    date: "2025년 6월 2일"
  },
  {
    id: 4,
    name: "고객4",
    package: "지중해의 보석, 산토리니",
    packageId: 3,
    rating: 5,
    comment: "산토리니는 정말 꿈같은 곳이었어요. 흰색 건물과 파란 지붕의 조화가 너무 아름다웠고, 이아 마을에서 본 석양은 평생 잊지 못할 것 같아요. 호텔 발코니에서 에게해를 바라보며 마시는 아침 커피는 그 자체로 힐링이었습니다. 현지 음식도 신선하고 맛있었습니다.",
    date: "2025년 5월 30일"
  },
  {
    id: 5,
    name: "고객5",
    package: "후쿠오카 맛집 탐방 3일",
    packageId: 6,
    rating: 4,
    comment: "맛집 투어라는 콘셉트에 끌려서 신청했는데, 정말 만족스러웠어요! 라멘, 모츠나베, 멘타이코 등 현지 음식을 다양하게 맛볼 수 있었고, 가이드가 추천해준 이자카야도 분위기가 좋았습니다. 다만 자유시간이 조금 더 있었으면 좋겠다는 아쉬움이 있네요.",
    date: "2025년 6월 18일"
  },
  {
    id: 6,
    name: "고객6",
    package: "베트남 후에 & 다낭 5일",
    packageId: 5,
    rating: 5,
    comment: "베트남 여행은 처음이었는데, 다낭과 후에의 매력에 푹 빠졌어요. 특히 미케 비치의 해변 풍경과 후에의 역사적인 유적지가 인상적이었습니다. 호이안의 야경도 너무 예뻤고, 현지 음식도 맛있었어요. 가이드가 친절하게 설명해주셔서 베트남의 역사와 문화를 이해하는 데 많은 도움이 되었습니다.",
    date: "2025년 6월 5일"
  },
  {
    id: 7,
    name: "고객7",
    package: "그리스 산토리니 & 아테네 8일",
    packageId: 7,
    rating: 5,
    comment: "아테네의 역사적 유적지와 산토리니의 아름다운 풍경을 모두 볼 수 있어서 너무 좋았습니다. 아크로폴리스와 파르테논 신전의 웅장함에 감탄했고, 산토리니에서는 에게해를 바라보며 와인을 마시는 경험이 환상적이었습니다. 호텔과 식사도 모두 만족스러웠어요.",
    date: "2025년 6월 20일"
  },
  {
    id: 8,
    name: "고객8",
    package: "하와이 오아후 & 마우이 7일",
    packageId: 8,
    rating: 4,
    comment: "하와이의 아름다운 해변과 자연환경이 정말 인상적이었어요. 와이키키 비치에서의 서핑 체험과 마우이의 할레아칼라 국립공원 방문이 특히 좋았습니다. 호텔도 깨끗하고 직원들이 친절했어요. 다만 일부 관광지가 너무 붐비는 점은 아쉬웠습니다.",
    date: "2025년 5월 15일"
  },
  {
    id: 9,
    name: "고객9",
    package: "캐나다 밴쿠버 & 로키 9일",
    packageId: 9,
    rating: 5,
    comment: "캐나다 로키산맥의 장관은 말로 표현할 수 없을 정도로 아름다웠습니다. 레이크 루이스와 밴프 국립공원의 풍경이 특히 인상적이었고, 밴쿠버의 도시 분위기도 좋았어요. 가이드의 설명이 자세하고 전문적이어서 더욱 의미 있는 여행이 되었습니다. 강력 추천합니다!",
    date: "2025년 6월 10일"
  },
  {
    id: 10,
    name: "고객10",
    package: "교토 단풍 명소 5일",
    packageId: 10,
    rating: 5,
    comment: "교토의 가을 단풍은 정말 환상적이었습니다. 아라시야마의 대나무 숲과 기요미즈데라 사원의 단풍이 특히 아름다웠어요. 료칸에서의 숙박 경험도 특별했고, 일본 전통 문화를 체험할 수 있어서 좋았습니다. 가이드의 일본 역사에 대한 해박한 지식이 여행을 더욱 풍부하게 만들어 주었어요.",
    date: "2025년 6월 7일"
  },
  {
    id: 11,
    name: "고객11",
    package: "핀란드 오로라 헌팅 6일",
    packageId: 11,
    rating: 5,
    comment: "평생 한 번은 보고 싶었던 오로라를 마침내 볼 수 있어서 너무 감격스러웠습니다. 로바니에미에서의 오로라 헌팅은 잊지 못할 경험이었고, 허스키 썰매와 산타마을 방문도 즐거웠습니다. 극한의 추위가 있었지만 그만한 가치가 있는 여행이었어요. 다음에는 여름에 백야를 보러 가보고 싶네요.",
    date: "2025년 5월 25일"
  },
  {
    id: 12,
    name: "고객12",
    package: "홋카이도 스키 & 온천 5일",
    packageId: 12,
    rating: 4,
    comment: "니세코의 파우더 스노우는 정말 최고였습니다! 스키를 타고 내려오는 느낌이 마치 구름 위를 날아다니는 것 같았어요. 스키 후에 즐기는 온천도 피로를 확 풀어주었고, 삿포로에서의 맥주와 징기스칸도 맛있었습니다. 다만 성수기라 사람이 조금 많았던 것이 아쉬웠어요.",
    date: "2025년 6월 12일"
  }
];

export default function Reviews() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [filteredReviews, setFilteredReviews] = useState(reviewsData);

  // 검색어와 별점 필터를 적용하는 함수
  const applyFilters = () => {
    let results = reviewsData;
    
    if (searchTerm) {
      results = results.filter(
        review => 
          review.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRating) {
      results = results.filter(review => review.rating === selectedRating);
    }
    
    setFilteredReviews(results);
  };

  // 검색어 입력 처리
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    applyFilters();
  };

  // 별점 필터 처리
  const handleRatingFilter = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };

  // 별점 필터가 변경될 때마다 필터 적용
  useEffect(() => {
    applyFilters();
  }, [selectedRating, searchTerm]);

  return (
    <main className="bg-neutral-50 min-h-screen pb-20">
      {/* 헤더 섹션 */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-4">
            <Link href="/" className="flex items-center text-white hover:text-blue-100 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">홈으로 돌아가기</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">고객 여행 후기</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            TripStore와 함께한 고객들의 생생한 여행 후기를 확인하세요. 실제 경험을 바탕으로 한 솔직한 리뷰가 여러분의 여행 계획에 도움이 될 것입니다.
          </p>
        </div>
      </section>

      {/* 검색 및 필터 섹션 */}
      <section className="py-8 border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-grow max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="여행지나 키워드로 검색"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-md px-3 py-1 text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  검색
                </button>
              </div>
            </form>
            
            <div className="flex items-center">
              <div className="mr-2 flex items-center text-sm font-medium text-neutral-600">
                <Filter className="h-4 w-4 mr-1" />
                별점:
              </div>
              <div className="flex space-x-1">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilter(rating)}
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${
                      selectedRating === rating
                        ? "bg-blue-600 text-white"
                        : "bg-white text-yellow-400 border border-neutral-200 hover:border-blue-400"
                    }`}
                  >
                    <span>{rating}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-neutral-500">
            {filteredReviews.length}개의 후기가 있습니다
            {selectedRating && ` (${selectedRating}점 필터 적용중)`}
            {searchTerm && ` "${searchTerm}" 검색 결과`}
          </div>
        </div>
      </section>

      {/* 리뷰 리스트 섹션 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center mr-4">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-neutral-900">{review.name}</h3>
                      <p className="text-sm text-neutral-500">{review.date}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill={i < review.rating ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Link href={`/packages/${review.packageId}`} className="inline-block mb-3">
                    <span className="text-blue-600 font-medium hover:underline">{review.package}</span>
                  </Link>
                  
                  <p className="text-neutral-600 mb-4">{review.comment}</p>
                  
                  <div className="border-t border-neutral-100 pt-4 mt-2">
                    <Link href={`/packages/${review.packageId}`} className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                      이 패키지 더 알아보기 →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 lg:col-span-2 text-center py-12">
                <div className="text-neutral-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-neutral-700 mb-2">검색 결과가 없습니다</h3>
                <p className="text-neutral-500">
                  다른 키워드로 검색하거나 필터를 초기화해 보세요.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRating(null);
                    setFilteredReviews(reviewsData);
                  }}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  필터 초기화
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* 리뷰 작성 유도 섹션 */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-neutral-800 mb-4">
              최근에 TripStore와 함께 여행하셨나요?
            </h2>
            <p className="text-neutral-600 mb-6">
              여러분의 소중한 경험과 의견을 다른 여행자들과 공유해주세요.
              후기를 남겨주시는 모든 고객님께 다음 여행 시 사용 가능한 5% 할인 쿠폰을 드립니다!
            </p>
            <Link
              href="/mypage"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300"
            >
              후기 작성하러 가기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
