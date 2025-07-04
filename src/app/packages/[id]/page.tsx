"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import {
  Calendar,
  MapPin,
  Users,
  Utensils,
  Home,
  Camera,
  Plane,
  Clock,
  Check,
  X,
  ArrowLeft,
  ChevronRight,
  CalendarCheck,
  Share2,
  Heart,
  ShoppingCart
} from "lucide-react";
import { TravelPackage, packagesData } from "@/data/packagesData";

// 클라이언트 컴포넌트에서 직접 패키지 검색 함수 구현
function getPackageById(id: string | number) {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return packagesData.find(pkg => pkg.id === numId);
}

// 패키지 기능 정의
const packageFeatures = [
  { key: 'duration', icon: Clock, label: '여행 기간' },
  { key: 'destination', icon: MapPin, label: '여행지' },
  { key: 'groupSize', icon: Users, label: '그룹 규모' },
  { key: 'meals', icon: Utensils, label: '제공 식사' },
  { key: 'accommodation', icon: Home, label: '숙박 시설' },
  { key: 'activities', icon: Camera, label: '주요 활동' },
  { key: 'departureDate', icon: Calendar, label: '출발일' },
  { key: 'transportation', icon: Plane, label: '교통 수단' },
];

export default function PackageDetail() {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState("1");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      const packageId = typeof params.id === "string" ? params.id : params.id[0];
      const data = getPackageById(packageId);
      if (data) {
        setPackageData(data);
        if (data.departureDate && data.departureDate.length > 0) {
          setSelectedDate(new Date(data.departureDate[0]));
        }
      }
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">상품을 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-8">요청하신 여행 상품이 존재하지 않거나 삭제되었습니다.</p>
        <button
          onClick={() => router.push("/packages")}
          className="px-6 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors flex items-center mx-auto"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          모든 상품 보기
        </button>
      </div>
    );
  }

  const handlePrevImage = () => {
    if (!packageData.gallery) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? packageData.gallery!.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!packageData.gallery) return;
    setCurrentImageIndex((prev) => 
      prev === packageData.gallery!.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* 헤더 이미지 */}
      <div className="relative h-[50vh] lg:h-[60vh]">
        <Image
          src={packageData.gallery ? packageData.gallery[currentImageIndex] : packageData.image}
          alt={packageData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10"></div>
        
        {/* 이미지 갤러리 내비게이션 */}
        {packageData.gallery && packageData.gallery.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
            {packageData.gallery.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentImageIndex ? "bg-white scale-110" : "bg-white/50"
                }`}
                aria-label={`이미지 ${index + 1} 보기`}
              />
            ))}
          </div>
        )}
        
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.push("/packages")}
          className="absolute top-6 left-6 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-5 w-5 text-gray-800" />
        </button>
        
        {/* 공유 및 좋아요 버튼 */}
        <div className="absolute top-6 right-6 z-10 flex space-x-2">
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all" aria-label="공유하기">
            <Share2 className="h-5 w-5 text-gray-800" />
          </button>
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all" aria-label="좋아요">
            <Heart className="h-5 w-5 text-gray-800" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="w-full md:w-8/12">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                  {packageData.type}
                </span>
                {packageData.rating && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-md">
                    ★ {packageData.rating} / 5
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {packageData.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {packageData.description}
              </p>

              {/* 탭 메뉴 */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === "overview"
                        ? "border-gray-800 text-gray-800"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    개요
                  </button>
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === "itinerary"
                        ? "border-gray-800 text-gray-800"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    일정
                  </button>
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`py-3 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === "details"
                        ? "border-gray-800 text-gray-800"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    포함/불포함
                  </button>
                </nav>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="py-2">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {packageFeatures.map((feature) => {
                        const value = packageData[feature.key as keyof TravelPackage];
                        if (!value) return null;
                        
                        return (
                          <div key={feature.key} className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                              <feature.icon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-gray-800">{feature.label}</h3>
                              <div className="mt-1 text-sm text-gray-600">
                                {Array.isArray(value) ? (
                                  <div className="flex flex-wrap gap-1">
                                    {value.slice(0, 3).map((item, i) => (
                                      <span key={i}>
                                        {typeof item === 'string' && item}
                                        {i < Math.min(value.length, 3) - 1 && ", "}
                                      </span>
                                    ))}
                                    {value.length > 3 && " 외 " + (value.length - 3) + "개"}
                                  </div>
                                ) : (
                                  <span>{value}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {packageData.highlights && packageData.highlights.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">하이라이트</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {packageData.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-700">
                                  <Check className="h-4 w-4" />
                                </div>
                              </div>
                              <p className="ml-3 text-sm text-gray-700">{highlight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "itinerary" && (
                  <div className="space-y-6">
                    {packageData.itinerary ? (
                      <div className="space-y-8">
                        {packageData.itinerary.map((day, index) => (
                          <div key={index} className="relative">
                            {index !== packageData.itinerary!.length - 1 && (
                              <div className="absolute top-10 bottom-0 left-4 w-0.5 bg-gray-200"></div>
                            )}
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 z-10">
                                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 text-white font-medium text-sm">
                                  {day.day}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden flex-1">
                                <div className="p-4">
                                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{day.title}</h3>
                                  <p className="text-gray-600">{day.description}</p>
                                </div>
                                {day.image && (
                                  <div className="relative h-48 w-full">
                                    <Image
                                      src={day.image}
                                      alt={day.title}
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">일정 정보가 없습니다.</p>
                    )}
                  </div>
                )}

                {activeTab === "details" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">포함 사항</h3>
                      {packageData.includes && packageData.includes.length > 0 ? (
                        <ul className="space-y-2">
                          {packageData.includes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <Check className="h-4 w-4 text-green-500" />
                              </div>
                              <p className="ml-2 text-gray-600">{item}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">포함 사항 정보가 없습니다.</p>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">불포함 사항</h3>
                      {packageData.excludes && packageData.excludes.length > 0 ? (
                        <ul className="space-y-2">
                          {packageData.excludes.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <X className="h-4 w-4 text-red-500" />
                              </div>
                              <p className="ml-2 text-gray-600">{item}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">불포함 사항 정보가 없습니다.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 예약 사이드바 */}
            <div className="w-full md:w-4/12 sticky top-24">
              <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{packageData.price}</h3>
                  <p className="text-sm text-gray-500">1인 기준, 세금 포함</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">출발일 선택</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <select
                        value={selectedDate ? selectedDate.toISOString() : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedDate(new Date(e.target.value));
                          } else {
                            setSelectedDate(null);
                          }
                        }}
                        className="w-full pl-10 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 cursor-pointer"
                      >
                        <option value="">출발일을 선택하세요</option>
                        {(() => {
                          // 현재 날짜부터 내년까지의 날짜 옵션 생성 (2주 간격으로)
                          const dates = [];
                          const now = new Date();
                          const endDate = new Date(now);
                          endDate.setFullYear(endDate.getFullYear() + 1); // 내년까지
                          
                          // 2주 간격으로 날짜 생성
                          let currentDate = new Date(now);
                          currentDate.setHours(0, 0, 0, 0);
                          
                          while (currentDate <= endDate) {
                            const dateISO = currentDate.toISOString();
                            const formattedDate = currentDate.toLocaleDateString('ko-KR', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            });
                            
                            dates.push(
                              <option key={dateISO} value={dateISO}>
                                {formattedDate}
                              </option>
                            );
                            
                            // 2주 후 날짜로 이동
                            const nextDate = new Date(currentDate);
                            nextDate.setDate(nextDate.getDate() + 14);
                            currentDate = nextDate;
                          }
                          
                          return dates;
                        })()
                        })()
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">인원 수</label>
                    <select 
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">1명</option>
                      <option value="2">2명</option>
                      <option value="3">3명</option>
                      <option value="4">4명</option>
                      <option value="5">5명 이상</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    if (!selectedDate) {
                      alert("출발일을 선택해주세요.");
                      return;
                    }
                    
                    // ISO 문자열로 전달하여 데이터 손실 방지
                    const isoDate = selectedDate.toISOString();
                    
                    // URL에서는 URL 인코딩하여 전달
                    const encodedDate = encodeURIComponent(isoDate);
                    
                    router.push(`/reservation?packageId=${packageData.id}&departureDate=${encodedDate}&travelers=${travelers}`);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-sm transition-colors flex items-center justify-center mb-3"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  예약하기
                </button>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-4">
                    <CalendarCheck className="h-5 w-5 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-600">예약 가능 여부 확인 가능</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
