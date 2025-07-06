"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, CreditCard, Check, Info, User, Users, Mail, Phone, MapPin, Globe, Shield, AlertCircle } from "lucide-react";

// 패키지 타입 정의
interface Package {
  id: string;
  title: string;
  description: string;
  destination: string;
  price: string;
  duration: string;
  imageUrl: string;
  category: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  itinerary: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DB에서 패키지 정보 가져오기
async function getPackageById(id: string) {
  try {
    const response = await fetch(`/api/packages/${id}`);
    if (!response.ok) {
      throw new Error('패키지를 찾을 수 없습니다.');
    }
    return await response.json();
  } catch (error) {
    console.error('패키지 조회 오류:', error);
    return null;
  }
}


interface ReservationForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  travelers: number;
  departureDate: Date | null;
  specialRequests: string;
  agreeToTerms: boolean;
  paymentMethod: "bankTransfer";
}

interface ReservationFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  travelers?: string;
  departureDate?: string;
  specialRequests?: string;
  agreeToTerms?: string;
  paymentMethod?: string;
}

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-10 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-40 bg-gray-200 rounded w-full"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>}>
      <ReservationContent />
    </Suspense>
  );
}

function ReservationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  
  const [form, setForm] = useState<ReservationForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    travelers: 1,
    departureDate: null,
    specialRequests: "",
    agreeToTerms: false,
    paymentMethod: "bankTransfer"
  });

  const [errors, setErrors] = useState<ReservationFormErrors>({});

  // 가격 포맷팅 함수
  const formatPrice = (price: string) => {
    const numPrice = parseInt(price.replace(/[^\d]/g, ''));
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  // 총 가격 계산 함수
  const calculateTotalPrice = () => {
    if (!packageData) return '₩0';
    const basePrice = parseInt(packageData.price.replace(/[^\d]/g, ''));
    const total = basePrice * form.travelers;
    return formatPrice(total.toString());
  };

  useEffect(() => {
    const packageId = searchParams.get("packageId");
    const departureDate = searchParams.get("departureDate");
    const travelers = searchParams.get("travelers");
    
    if (packageId) {
      getPackageById(packageId).then(data => {
        if (data) {
          setPackageData(data);
          
          // 초기값 설정
          let initialDate = null;
          
          if (departureDate) {
            try {
              // URL에서 받은 날짜를 디코딩하여 Date 객체로 변환
              initialDate = new Date(decodeURIComponent(departureDate));
            } catch (error) {
              console.error("날짜 변환 오류:", error);
              initialDate = null;
            }
          }
          
          // 유효한 날짜인지 확인
          if (initialDate instanceof Date && !isNaN(initialDate.getTime())) {
            setForm(prev => ({
              ...prev,
              departureDate: initialDate,
              travelers: travelers ? parseInt(travelers) : 1
            }));
          } else {
            setForm(prev => ({
              ...prev,
              departureDate: null,
              travelers: travelers ? parseInt(travelers) : 1
            }));
          }
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ReservationForm> = {};
    
    if (step === 1) {
      if (!form.firstName.trim()) newErrors.firstName = "이름을 입력해주세요";
      if (!form.lastName.trim()) newErrors.lastName = "성을 입력해주세요";
      if (!form.email.trim()) {
        newErrors.email = "이메일을 입력해주세요";
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "유효한 이메일 주소를 입력해주세요";
      }
      if (!form.phone.trim()) newErrors.phone = "전화번호를 입력해주세요";
      if (!form.departureDate) newErrors.departureDate = "출발일을 선택해주세요";
    } else if (step === 2) {
      if (!form.agreeToTerms) newErrors.agreeToTerms = "약관에 동의해주세요";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // 입력시 해당 필드의 에러 제거
    if (errors[name as keyof ReservationForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setForm(prev => ({
      ...prev,
      departureDate: date
    }));
    
    // 날짜 선택 시 에러 제거
    if (date && errors.departureDate) {
      setErrors(prev => ({
        ...prev,
        departureDate: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      try {
        console.log('예약 생성 시작');
        
        // 예약 데이터 구성
        const reservationData = {
          userId: null, // 현재 로그인 기능이 없으므로 null
          packageId: packageData.id,
          departureDate: form.departureDate?.toISOString().split('T')[0] || '',
          travelers: form.travelers,
          totalPrice: calculateTotalPrice().replace(/[^\d]/g, ''), // 숫자만 추출
          status: 'pending',
          paymentStatus: 'pending',
          contactName: `${form.lastName} ${form.firstName}`,
          contactEmail: form.email,
          contactPhone: form.phone,
          specialRequests: form.specialRequests || null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log('예약 데이터:', reservationData);

        // 예약 생성 API 호출
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });

        console.log('API 응답 상태:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API 오류 응답:', errorText);
          
          let errorMessage = '예약 생성에 실패했습니다.';
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          
          throw new Error(errorMessage);
        }

        const newReservation = await response.json();
        console.log('예약 생성 완료:', newReservation);
        
        // 예약 완료 처리
        setReservationComplete(true);
        setReservationCode(`TS-${newReservation.id.substring(0, 8)}`);
        
      } catch (error) {
        console.error('예약 생성 오류:', error);
        alert(`예약 생성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-600">예약 페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">상품 정보를 찾을 수 없습니다</h2>
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

  if (reservationComplete) {
    return (
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">예약이 완료되었습니다!</h1>
              <p className="text-gray-600">
                예약 확인 이메일이 곧 <span className="font-medium">{form.email}</span>로 발송됩니다.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">예약 정보</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">예약 번호:</span>
                  <span className="font-medium text-gray-900">{reservationCode}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">여행 상품:</span>
                  <span className="font-medium text-gray-900">{packageData.name}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">출발일:</span>
                  <span className="font-medium text-blue-600">{form.departureDate ? form.departureDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">인원:</span>
                  <span className="font-medium text-gray-900">{form.travelers}명</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">결제 방법:</span>
                  <span className="font-medium text-gray-900">계좌이체</span>
                </div>
                
                <div className="flex justify-between pb-3 border-b border-gray-100">
                  <span className="text-gray-600">총 결제 금액:</span>
                  <span className="font-bold text-blue-600">{calculateTotalPrice()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-8 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">다음 단계</h3>
                <p className="text-blue-700 text-sm">
                  예약 확인 이메일에는 여행 준비에 필요한 모든 정보가 포함되어 있습니다. 
                  궁금한 점이 있으시면 언제든지 고객센터로 문의해 주세요.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="px-6 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors text-center"
              >
                홈으로 돌아가기
              </Link>
              
              <Link 
                href="/mypage"
                className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-center"
              >
                내 예약 확인하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>뒤로 가기</span>
          </button>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">여행 예약하기</h1>
          
          {/* 진행 단계 표시 */}
          <div className="flex justify-between items-center mb-8 max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                <User className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-600">예약자 정보</span>
            </div>
            
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-600">결제 정보</span>
            </div>
            
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs text-gray-600">완료</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 예약 폼 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <form onSubmit={handleSubmit}>
                  {/* 단계 1: 예약자 정보 */}
                  {currentStep === 1 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6">예약자 정보</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            이름 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.firstName ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            성 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.lastName ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          이메일 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleInputChange}
                            className={`w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.email ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="your-email@example.com"
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          예약 확인서와 여행 정보가 이메일로 발송됩니다.
                        </p>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          전화번호 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleInputChange}
                            className={`w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.phone ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="010-1234-5678"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
                            인원 수 <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                              id="travelers"
                              name="travelers"
                              value={form.travelers}
                              onChange={handleInputChange}
                              className="w-full pl-10 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                <option key={num} value={num}>{num}명</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-2">
                            출발일 <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-blue-500" />
                            </div>
                            <select
                              id="departureDate"
                              value={form.departureDate ? form.departureDate.toISOString() : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : null;
                                setForm(prev => ({ ...prev, departureDate: date }));
                                // 날짜 선택 시 에러 제거
                                if (date && errors.departureDate) {
                                  setErrors(prev => ({
                                    ...prev,
                                    departureDate: undefined
                                  }));
                                }
                              }}
                              className={`w-full pl-10 py-3 border bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-gray-900 cursor-pointer ${
                                errors.departureDate ? "border-red-500 ring-1 ring-red-500" : "border-gray-300"
                              }`}
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
                              })()}
                            </select>
                            {errors.departureDate && (
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </div>
                            )}
                          </div>
                          {errors.departureDate && (
                            <p className="mt-1 text-sm text-red-500">{errors.departureDate}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                          특별 요청사항 (선택)
                        </label>
                        <textarea
                          id="specialRequests"
                          name="specialRequests"
                          value={form.specialRequests}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="식이 제한, 특별 지원 등 요청사항이 있으시면 알려주세요."
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {/* 단계 2: 결제 정보 */}
                  {currentStep === 2 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6">결제 정보</h2>
                      
                      <div className="mb-6">
                        <p className="font-medium text-gray-700 mb-2">결제 방법</p>
                        <div className="space-y-2">
                          <div className="flex items-center p-3 border border-gray-300 rounded-md bg-gray-50">
                            <div className="h-4 w-4 bg-blue-600 rounded-full border-gray-300 mr-2"></div>
                            <span className="text-gray-700 font-medium">계좌이체</span>
                          </div>
                          <p className="text-sm text-gray-600 pl-2 mt-1">
                            아래 계좌로 입금해 주시면 확인 후 예약이 확정됩니다.
                          </p>
                          <div className="p-4 bg-gray-50 rounded-md border border-gray-200 mt-2">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">입금 계좌:</span> 신한은행 123-456-789012
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">예금주:</span> (주)트립스토어
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">입금자명:</span> {form.lastName + form.firstName} (예약자명과 동일하게 입금)
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start mb-6">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeToTerms"
                            name="agreeToTerms"
                            type="checkbox"
                            checked={form.agreeToTerms}
                            onChange={handleInputChange}
                            className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                              errors.agreeToTerms ? "border-red-500" : ""
                            }`}
                          />
                        </div>
                        <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                          본인은 <a href="#" className="text-blue-600 hover:text-blue-800">이용약관</a> 및 <a href="#" className="text-blue-600 hover:text-blue-800">개인정보 처리방침</a>에 동의합니다. <span className="text-red-500">*</span>
                        </label>
                      </div>
                      {errors.agreeToTerms && (
                        <p className="mt-1 text-sm text-red-500 mb-6">{errors.agreeToTerms}</p>
                      )}
                    </div>
                  )}
                  
                  {/* 단계 3: 예약 확인 */}
                  {currentStep === 3 && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-6">예약 확인</h2>
                      
                      <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h3 className="font-semibold text-gray-800 mb-3">여행 정보</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-neutral-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">목적지</p>
                                <p className="text-sm text-gray-600">{packageData.destination}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mr-3">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">출발일</p>
                                <p className="text-sm font-bold text-blue-600">{form.departureDate ? form.departureDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <Users className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">인원</p>
                                <p className="text-sm text-gray-600">{form.travelers}명</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <CreditCard className="h-5 w-5 text-gray-500 mt-0.5 mr-2" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">결제 방법</p>
                                <p className="text-sm text-gray-600">계좌이체</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h3 className="font-semibold text-gray-800 mb-3">예약자 정보</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700">이름</p>
                              <p className="text-sm text-gray-600">{form.lastName} {form.firstName}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700">이메일</p>
                              <p className="text-sm text-gray-600">{form.email}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700">전화번호</p>
                              <p className="text-sm text-gray-600">{form.phone}</p>
                            </div>
                          </div>
                          
                          {form.specialRequests && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700">특별 요청사항</p>
                              <p className="text-sm text-gray-600">{form.specialRequests}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-md flex items-start">
                          <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                          <p className="text-sm text-blue-700">
                            예약을 완료하시면 <strong>{form.email}</strong>로 예약 확인 메일이 발송됩니다. 
                            자세한 여행 정보와 준비물은 메일에 첨부됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        이전
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        다음
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        예약 완료하기
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            {/* 예약 요약 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">예약 요약</h2>
                
                <div className="mb-4">
                  <div className="relative h-36 w-full rounded-md overflow-hidden mb-3">
                    <Image
                      src={packageData.imageUrl}
                      alt={packageData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800">{packageData.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{packageData.description}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{packageData.duration}</span>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-100 py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">기본 가격 (1인)</span>
                    <span className="font-medium">{formatPrice(packageData.price)}</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">인원</span>
                    <span>{form.travelers}명</span>
                  </div>
                  
                  <div className="flex justify-between pt-3 border-t border-gray-100">
                    <span className="font-bold text-gray-800">총 금액</span>
                    <span className="font-bold text-blue-600">{calculateTotalPrice()}</span>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Shield className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <span className="text-gray-600">안전한 결제 시스템</span>
                  </div>
                  
                  <div className="flex items-start">
                    <Globe className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <span className="text-gray-600">24/7 전세계 고객 지원</span>
                  </div>
                  

                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    도움이 필요하신가요? <Link href="/contact" className="text-blue-600 hover:text-blue-800">고객센터 문의하기</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
