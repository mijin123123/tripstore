'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Users, ArrowLeft, CreditCard, Briefcase, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { Package } from '@/types'
import { getPackageById } from '@/lib/api'

// 여행자 정보 타입 정의
interface Traveler {
  name: string
  birthdate: string
  gender: string
  phone: string
  email: string
  passportNumber?: string // 해외 여행의 경우에만 필요
  passportExpiry?: string // 해외 여행의 경우에만 필요
}

// 예약 정보 타입 정의
interface BookingInfo {
  departureDate: string
  checkoutDate: string // 체크아웃 날짜 추가
  nights: number // 숙박 박수 추가
  travelerCount: number
  travelers: Traveler[]
  specialRequests: string
  agreeTerms: boolean
  bankAccount: string // 무통장 입금 계좌 정보
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [openSection, setOpenSection] = useState<string>("packageInfo");
  const [action, setAction] = useState<string>("reserve"); // 기본값은 예약 모드

  // 이미지 경로를 실제 존재하는 이미지로 매핑하는 함수
  const getValidImagePath = (imagePath: string = '', type: string = '', region: string = '') => {
    console.log('getValidImagePath 호출됨:', { imagePath: imagePath?.substring(0, 50) + (imagePath?.length > 50 ? '...' : ''), type, region });
    
    // Base64 이미지인 경우 그대로 사용
    if (imagePath && imagePath.startsWith('data:image/')) {
      console.log('Base64 이미지 사용:', imagePath.substring(0, 50) + '...');
      return imagePath;
    }
    
    // Supabase 스토리지 이미지 URL인 경우 그대로 사용
    if (imagePath && imagePath.includes('supabase.co/storage')) {
      console.log('Supabase 스토리지 이미지 사용:', imagePath);
      return imagePath;
    }
    
    // 이미지 경로가 이미 올바른 경우 그대로 반환
    if (imagePath && imagePath.startsWith('/images/') && 
        ['hotel-hero.jpg', 'europe-hero.jpg', 'japan-hero.jpg', 'luxury-hero.jpg', 
         'overseas-hero.jpg', 'domestic-hero.jpg', 'guam-hero.jpg', 'hongkong-hero.jpg',
         'americas-hero.jpg', 'southeast-asia-hero.jpg', 'hotel-europe-hero.jpg'].some(img => imagePath.includes(img))) {
      console.log('기존 이미지 경로 사용:', imagePath);
      return imagePath;
    }
    
    // 일반 URL 이미지 경로인 경우 그대로 사용
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/'))) {
      console.log('URL 이미지 경로 사용:', imagePath);
      return imagePath;
    }
    
    // 타입과 지역에 따른 기본 이미지 매핑 (더 포괄적으로 수정)
    const imageMapping: Record<string, string> = {
      // 해외여행 이미지
      'overseas-europe': '/images/europe-hero.jpg',
      'overseas-japan': '/images/japan-hero.jpg',
      'overseas-guam': '/images/guam-hero.jpg',
      'overseas-guam-saipan': '/images/guam-hero.jpg',
      'overseas-hongkong': '/images/hongkong-hero.jpg',
      'overseas-china-hongkong': '/images/hongkong-hero.jpg',
      'overseas-americas': '/images/americas-hero.jpg',
      'overseas-southeast-asia': '/images/southeast-asia-hero.jpg',
      
      // 호텔 이미지
      'hotel-europe': '/images/hotel-europe-hero.jpg',
      'hotel-japan': '/images/japan-hero.jpg',
      'hotel-guam': '/images/guam-hero.jpg',
      'hotel-guam-saipan': '/images/guam-hero.jpg',
      'hotel-hongkong': '/images/hongkong-hero.jpg',
      'hotel-china-hongkong': '/images/hongkong-hero.jpg',
      'hotel-americas': '/images/americas-hero.jpg',
      'hotel-southeast-asia': '/images/southeast-asia-hero.jpg',
      
      // 국내 여행 이미지
      'domestic-hotel': '/images/domestic-hero.jpg',
      'domestic-resort': '/images/domestic-hero.jpg',
      'domestic-pool-villa': '/images/domestic-hero.jpg',
      
      // 럭셔리 이미지
      'luxury-europe': '/images/luxury-hero.jpg',
      'luxury-japan': '/images/japan-hero.jpg',
      'luxury-southeast-asia': '/images/southeast-asia-hero.jpg',
      
      // 기본 이미지
      'hotel-default': '/images/hotel-hero.jpg',
      'luxury-default': '/images/luxury-hero.jpg',
      'domestic-default': '/images/domestic-hero.jpg',
      'overseas-default': '/images/overseas-hero.jpg'
    };
    
    // 타입과 지역 조합으로 이미지 찾기
    const key = `${type}-${region}`;
    console.log('매핑 키 시도:', key);
    
    if (imageMapping[key]) {
      console.log('매핑된 이미지:', imageMapping[key]);
      return imageMapping[key];
    }
    
    // 타입별 기본 이미지
    const typeKey = `${type}-default`;
    if (imageMapping[typeKey]) {
      console.log('타입별 기본 이미지:', imageMapping[typeKey]);
      return imageMapping[typeKey];
    }
    
    // 최후의 기본 이미지
    console.log('최종 기본 이미지 사용');
    return '/images/hotel-hero.jpg';
  };
  
  // 예약 정보 상태 관리
  const [bookingInfo, setBookingInfo] = useState<BookingInfo>({
    departureDate: "",
    checkoutDate: "",
    nights: 1,
    travelerCount: 1,
    travelers: [{ name: "", birthdate: "", gender: "", phone: "", email: "" }],
    specialRequests: "",
    agreeTerms: false,
    bankAccount: "로딩 중..."
  });

  // 사이트 설정 상태 관리
  const [siteSettings, setSiteSettings] = useState({
    paymentInstruction: "입금 시 예약자분 성함으로 부탁하며, 예약자분 변경을 원하시면 1:1 채팅 상담으로 문의 부탁합니다.",
    paymentConfirmationTime: "입금 확인 소요시간은 순차적으로 확인되며 최대 1일 ~ 2일 소요되며, 가입시 작성해주신 이메일로 안내 도움 드립니다."
  });
  
  // 패키지에 포함된 추천 출발일 (동적으로 설정될 예정)
  const [availableDates, setAvailableDates] = useState<{date: string, day: string}[]>([]);
  
  // URL 쿼리 파라미터 처리 효과
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const peopleParam = queryParams.get('people');
    const dateParam = queryParams.get('date');
    const actionParam = queryParams.get('action');
    
    console.log('URL 파라미터 - people:', peopleParam, 'date:', dateParam, 'action:', actionParam);
    
    // 인원 수 설정
    if (peopleParam) {
      const peopleCount = parseInt(peopleParam);
      if (!isNaN(peopleCount) && peopleCount > 0 && peopleCount <= 10) {
        handleTravelerCountChange(peopleCount);
      }
    }
    
    // 날짜 설정
    if (dateParam) {
      setSelectedDate(dateParam);
      handleDateSelect(dateParam);
    }
    
    // 액션 모드 설정 (예약 또는 결제)
    if (actionParam === 'payment') {
      setAction('payment');
      setCurrentStep(3); // 결제 단계로 바로 이동
      setOpenSection("paymentInfo"); // 결제 섹션 자동으로 열기
    } else {
      setAction('reserve');
      setCurrentStep(1); // 예약 정보 입력부터 시작
      setOpenSection("packageInfo"); // 패키지 정보 섹션 열기
    }
  }, []);
  
  useEffect(() => {
    const fetchPackage = async () => {
      if (params?.id) {
        const id = params.id as string;
        console.log('Booking page - ID received:', id);
        
        try {
          const packageInfo = await getPackageById(id);
          console.log('Booking page - Package found:', !!packageInfo);
          
          if (packageInfo) {
            console.log('Booking page - Package data:', packageInfo.title);
            console.log('Booking page - Package image:', packageInfo.image?.substring(0, 100));
            console.log('Booking page - Package type:', packageInfo.type);
            console.log('Booking page - Package category:', packageInfo.category);
            setPackageData(packageInfo);
            
            // 현재 날짜로부터 향후 3개월간의 추천 출발일 생성 (예시)
            const today = new Date();
            const recommendedDates = [];
            
            // 패키지 유형에 따라 적절한 출발일 설정
            if (packageInfo.departure === '매주 화/금 출발') {
              // 앞으로 3개월 내의 모든 화요일과 금요일 찾기
              for (let i = 0; i < 90; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const day = date.getDay(); // 0: 일요일, 1: 월요일, ..., 6: 토요일
                
                // 화요일(2) 또는 금요일(5)인 경우
                if (day === 2 || day === 5) {
                  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
                  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                  recommendedDates.push({
                    date: dateStr,
                    day: dayNames[day]
                  });
                  
                  // 최대 8개의 추천 날짜만 제공
                  if (recommendedDates.length >= 8) break;
                }
              }
            } else if (packageInfo.departure === '매주 월/금 출발') {
              // 앞으로 3개월 내의 모든 월요일과 금요일 찾기
              for (let i = 0; i < 90; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const day = date.getDay();
                
                // 월요일(1) 또는 금요일(5)인 경우
                if (day === 1 || day === 5) {
                  const dateStr = date.toISOString().split('T')[0];
                  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                  recommendedDates.push({
                    date: dateStr,
                    day: dayNames[day]
                  });
                  
                  if (recommendedDates.length >= 8) break;
                }
              }
            } else {
              // 기본적으로 앞으로 3개월 내의 모든 월요일, 수요일, 금요일 제공
              for (let i = 0; i < 90; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                const day = date.getDay();
                
                // 월요일(1), 수요일(3), 금요일(5)인 경우
                if (day === 1 || day === 3 || day === 5) {
                  const dateStr = date.toISOString().split('T')[0];
                  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
                  recommendedDates.push({
                    date: dateStr,
                    day: dayNames[day]
                  });
                  
                  if (recommendedDates.length >= 8) break;
                }
              }
            }
            
            setAvailableDates(recommendedDates);
          } else {
            console.error('패키지를 찾을 수 없습니다');
          }
        } catch (error) {
          console.error('패키지 로딩 중 오류 발생:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchPackage();
  }, [params]);

  // 사이트 설정에서 계좌정보 가져오기
  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        console.log('사이트 설정 조회 시작...')
        const response = await fetch('/api/site-settings')
        
        if (!response.ok) {
          throw new Error('사이트 설정을 불러오는데 실패했습니다.')
        }

        const result = await response.json()
        console.log('사이트 설정 조회 결과:', result)
        console.log('result.payment 존재:', !!result.payment)
        console.log('result.settings 존재:', !!result.settings)
        
        // payment 객체에서 계좌정보 가져오기
        if (result.payment) {
          const bankInfo = `${result.payment.payment_bank_name} ${result.payment.payment_account_number} ${result.payment.payment_account_holder}`
          
          setBookingInfo(prev => ({
            ...prev,
            bankAccount: bankInfo
          }))
          
          // 입금 안내 및 확인 시간도 업데이트
          setSiteSettings({
            paymentInstruction: result.payment.payment_instruction || "입금 시 예약자분 성함으로 부탁하며, 예약자분 변경을 원하시면 1:1 채팅 상담으로 문의 부탁합니다.",
            paymentConfirmationTime: result.payment.payment_confirmation_time || "입금 확인 소요시간은 순차적으로 확인되며 최대 1일 ~ 2일 소요되며, 가입시 작성해주신 이메일로 안내 도움 드립니다."
          })
          
          console.log('계좌정보 업데이트됨:', bankInfo)
          console.log('입금 안내 업데이트됨:', result.payment.payment_instruction)
          console.log('확인 시간 업데이트됨:', result.payment.payment_confirmation_time)
        } else if (result.settings) {
          // settings 배열에서 payment 관련 정보 찾기
          const paymentBankName = result.settings.find((s: any) => s.setting_key === 'payment_bank_name')?.setting_value
          const paymentAccountNumber = result.settings.find((s: any) => s.setting_key === 'payment_account_number')?.setting_value  
          const paymentAccountHolder = result.settings.find((s: any) => s.setting_key === 'payment_account_holder')?.setting_value
          
          if (paymentBankName && paymentAccountNumber && paymentAccountHolder) {
            const bankInfo = `${paymentBankName} ${paymentAccountNumber} ${paymentAccountHolder}`
            setBookingInfo(prev => ({
              ...prev,
              bankAccount: bankInfo
            }))
            console.log('설정 배열에서 계좌정보 업데이트됨:', bankInfo)
          } else {
            console.log('설정 배열에서 계좌정보를 찾을 수 없음, 기본값 사용')
            setBookingInfo(prev => ({
              ...prev,
              bankAccount: "신한은행 123-456-789012 (주)트립스토어"
            }))
          }
        } else {
          console.log('계좌정보를 찾을 수 없음, 기본값 사용')
          setBookingInfo(prev => ({
            ...prev,
            bankAccount: "신한은행 123-456-789012 (주)트립스토어"
          }))
        }
      } catch (error) {
        console.error('사이트 설정 조회 오류:', error)
        // 오류 시 기본값 사용
        setBookingInfo(prev => ({
          ...prev,
          bankAccount: "신한은행 123-456-789012 (주)트립스토어"
        }))
      }
    }

    fetchSiteSettings()
  }, [])
  
  // 여행자 정보 변경 핸들러
  const handleTravelerChange = (index: number, field: keyof Traveler, value: string) => {
    const updatedTravelers = [...bookingInfo.travelers];
    updatedTravelers[index] = { ...updatedTravelers[index], [field]: value };
    setBookingInfo({
      ...bookingInfo,
      travelers: updatedTravelers
    });
  };
  
  // 여행자 추가 핸들러
  const handleAddTraveler = () => {
    if (bookingInfo.travelers.length < bookingInfo.travelerCount) {
      setBookingInfo({
        ...bookingInfo,
        travelers: [...bookingInfo.travelers, { name: "", birthdate: "", gender: "", phone: "", email: "" }]
      });
    }
  };
  
  // 여행자 수 변경 핸들러
  const handleTravelerCountChange = (count: number) => {
    if (count < 1) count = 1;
    if (count > 10) count = 10;
    
    // 예약자 정보는 항상 유지
    let travelers = [...bookingInfo.travelers];
    
    // 첫 번째 여행자(예약자)가 없으면 빈 객체로 생성
    if (travelers.length === 0) {
      travelers = [{ name: "", birthdate: "", gender: "", phone: "", email: "" }];
    }
    
    // 여행자 수가 줄어들면 예약자는 유지하고 나머지만 제거
    if (count < travelers.length) {
      travelers = [travelers[0]]; // 예약자만 유지
    }
    
    // 여행자 수만큼 배열 크기 조정 (예약자 정보는 항상 첫 번째에 유지)
    while (travelers.length < count) {
      travelers.push({ name: "", birthdate: "", gender: "", phone: "", email: "" });
    }
    
    setBookingInfo({
      ...bookingInfo,
      travelerCount: count,
      travelers: travelers
    });
  };
  
  // 특별 요청 사항 변경 핸들러
  const handleSpecialRequestsChange = (value: string) => {
    setBookingInfo({
      ...bookingInfo,
      specialRequests: value
    });
  };
  
  // 약관 동의 핸들러
  const handleAgreeTermsChange = (checked: boolean) => {
    setBookingInfo({
      ...bookingInfo,
      agreeTerms: checked
    });
  };
  
  // 결제는 무통장 입금만 가능하므로 결제 방법 변경 핸들러는 필요 없음
  
  // 날짜 선택 핸들러
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const checkoutDate = calculateCheckoutDate(date, bookingInfo.nights);
    setBookingInfo({
      ...bookingInfo,
      departureDate: date,
      checkoutDate: checkoutDate
    });
  };

  // 체크아웃 날짜 계산 함수
  const calculateCheckoutDate = (checkinDate: string, nights: number) => {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkin);
    checkout.setDate(checkin.getDate() + nights);
    return checkout.toISOString().split('T')[0];
  };

  // 숙박 박수 변경 핸들러
  const handleNightsChange = (nights: number) => {
    if (nights < 1) nights = 1;
    if (nights > 30) nights = 30; // 최대 30박까지 허용
    
    const checkoutDate = bookingInfo.departureDate ? 
      calculateCheckoutDate(bookingInfo.departureDate, nights) : "";
    
    setBookingInfo({
      ...bookingInfo,
      nights: nights,
      checkoutDate: checkoutDate
    });
  };
  
  // 섹션 토글 핸들러
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? "" : section);
  };
  
  // 예약 제출 핸들러
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 폼 유효성 검사 (예약자 1명만 확인)
    const mainTraveler = bookingInfo.travelers[0];
    const isFormValid = bookingInfo.departureDate && 
                       mainTraveler && 
                       mainTraveler.name && 
                       mainTraveler.birthdate && 
                       mainTraveler.gender && 
                       mainTraveler.phone && 
                       mainTraveler.email &&
                       bookingInfo.agreeTerms;
    
    if (!isFormValid) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    
    try {
      // 예약 데이터 준비
      const bookingData = {
        packageId: packageData?.id,
        startDate: bookingInfo.departureDate, // departureDate → startDate로 변경
        quantity: bookingInfo.travelerCount,
        peopleCount: bookingInfo.travelerCount, // travelerCount → peopleCount로 변경
        travelerInfo: mainTraveler, // 예약자 정보만 저장
        specialRequests: bookingInfo.specialRequests,
        totalPrice: calculateTotalAmount(), // totalAmount → totalPrice로 변경
        cost: calculateTotalAmount(), // cost 필드도 추가
        userId: null // 현재는 인증 시스템이 없으므로 null
      };

      // API 호출하여 예약 생성
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("예약이 완료되었습니다. 예약 확인 메일이 곧 발송됩니다.");
        router.push(`/`); // 홈 페이지로 이동
      } else {
        console.error('예약 실패:', result);
        alert(`예약 중 오류가 발생했습니다: ${result.error}`);
      }
    } catch (error) {
      console.error('예약 API 호출 오류:', error);
      alert("예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  
  // 금액 계산 함수
  const calculateTotalAmount = () => {
    if (!packageData) return 0;
    
    // 패키지 가격이 이미 숫자 타입
    const basePrice = typeof packageData.price === 'number' ? packageData.price : parseInt(String(packageData.price).replace(/,/g, ''));
    
    // 국내 숙박은 박수 기준, 해외여행은 인원 기준
    if (packageData.type === 'domestic' && 
        (packageData.category === 'domestic-hotel' || 
         packageData.category === 'domestic-resort' || 
         packageData.category === 'domestic-pool-villa' || 
         packageData.category === 'domestic-pension')) {
      return basePrice * bookingInfo.nights;
    } else {
      return basePrice * bookingInfo.travelerCount;
    }
  };
  
  // 금액을 한국어 형식으로 포맷팅하는 함수 (예: 1,234,567원)
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-4">패키지를 찾을 수 없습니다</h1>
          <p className="mb-8 text-gray-600">요청하신 패키지 정보를 찾을 수 없습니다. 다른 패키지를 선택해주세요.</p>
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* 상단 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <Link href={`/package/${packageData.id}`} className="text-blue-600 hover:text-blue-800 flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>패키지 상세로 돌아가기</span>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{action === 'payment' ? '결제하기' : '예약하기'}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 - 예약 양식 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 패키지 정보 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection("packageInfo")}
              >
                <h2 className="text-xl font-semibold flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                  패키지 정보
                </h2>
                {openSection === "packageInfo" ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {openSection === "packageInfo" && (
                <div className="px-6 pb-6 border-t pt-4">
                  <div className="flex items-start">
                    <div className="w-24 h-24 rounded-lg overflow-hidden mr-4 shrink-0">
                      <img 
                        src={
                          // 실제 업로드된 이미지가 있으면 첫 번째 이미지 사용, 없으면 메인 이미지 사용
                          packageData.images && packageData.images.length > 0 
                            ? packageData.images[0] 
                            : getValidImagePath(packageData.image, packageData.type, packageData.region)
                        } 
                        alt={packageData.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.log('첫 번째 이미지 로드 실패. 다음 이미지 시도중...');
                          // 첫 번째 이미지 실패시 메인 이미지로 대체
                          if (packageData.images && packageData.images.length > 1) {
                            target.src = packageData.images[1];
                          } else {
                            target.src = '/images/package1.jpg';
                          }
                        }}
                        onLoad={() => {
                          console.log('패키지 이미지 로드 성공');
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{packageData.title}</h3>
                      <div className="flex items-center gap-1 text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{packageData.regionKo}</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="flex items-center mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{packageData.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>기본 {bookingInfo.travelerCount}인 예약</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 출발일 선택 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection("departureDate")}
              >
                <h2 className="text-xl font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  출발일 선택
                </h2>
                {openSection === "departureDate" ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {openSection === "departureDate" && (
                <div className="px-6 pb-6 border-t pt-4">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      여행 출발일
                    </label>
                    <div className="relative">
                      {/* 날짜 선택 입력 필드 */}
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors cursor-pointer"
                          value={bookingInfo.departureDate ? bookingInfo.departureDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1.$2.$3") : ""}
                          onClick={() => setShowCalendar(!showCalendar)}
                          readOnly
                          placeholder="출발일을 선택하세요"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                        </div>
                        
                        {/* 달력 컴포넌트 */}
                        {showCalendar && (
                          <div className="absolute z-20 mt-1 bg-white border rounded-lg shadow-lg p-4 w-72">
                            {/* 달력 헤더 */}
                            <div className="flex justify-between items-center mb-4">
                              <button 
                                type="button"
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  const newDate = new Date(currentMonth);
                                  newDate.setMonth(newDate.getMonth() - 1);
                                  setCurrentMonth(newDate);
                                }}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                              </button>
                              <h4 className="font-medium">
                                {new Date(currentMonth).getFullYear()}년 {new Date(currentMonth).getMonth() + 1}월
                              </h4>
                              <button 
                                type="button"
                                className="p-1 hover:bg-gray-100 rounded"
                                onClick={() => {
                                  const newDate = new Date(currentMonth);
                                  newDate.setMonth(newDate.getMonth() + 1);
                                  setCurrentMonth(newDate);
                                }}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </button>
                            </div>
                            
                            {/* 요일 표시 */}
                            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-1">
                              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                                <div key={index} className={`py-1 ${index === 0 ? 'text-red-500' : ''}`}>
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            {/* 날짜 그리드 */}
                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                              {(() => {
                                const year = currentMonth.getFullYear();
                                const month = currentMonth.getMonth();
                                const firstDay = new Date(year, month, 1).getDay(); // 이번 달 1일의 요일 (0: 일요일)
                                const lastDate = new Date(year, month + 1, 0).getDate(); // 이번 달의 마지막 날짜
                                
                                const days = [];
                                
                                // 빈 셀 추가
                                for (let i = 0; i < firstDay; i++) {
                                  days.push(
                                    <div key={`empty-${i}`} className="p-2"></div>
                                  );
                                }
                                
                                // 날짜 셀 추가
                                for (let day = 1; day <= lastDate; day++) {
                                  const dateObj = new Date(year, month, day);
                                  const dateString = dateObj.toISOString().split('T')[0];
                                  const isToday = new Date().toDateString() === dateObj.toDateString();
                                  const isRecommended = availableDates.some(d => d.date === dateString);
                                  const isSelected = bookingInfo.departureDate === dateString;
                                  const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                                  const isSunday = dateObj.getDay() === 0;
                                  
                                  days.push(
                                    <div 
                                      key={day}
                                      className={`p-2 relative ${
                                        isSelected ? 'bg-blue-600 text-white rounded-full' : 
                                        isToday ? 'bg-blue-50 text-blue-700 font-semibold' : 
                                        isSunday ? 'text-red-500' : 
                                        isWeekend ? 'text-gray-700' : 'text-gray-900'
                                      } hover:bg-blue-100 cursor-pointer flex items-center justify-center`}
                                      onClick={() => {
                                        handleDateSelect(dateString);
                                        setShowCalendar(false);
                                      }}
                                    >
                                      {day}
                                      {isRecommended && !isSelected && (
                                        <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                      )}
                                    </div>
                                  );
                                }
                                
                                return days;
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      추천 출발일은 아래에서 선택하세요.
                    </p>
                  </div>
                  
                  {/* 추천 출발일 */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">추천 출발일</p>
                    <div className="grid grid-cols-2 gap-2">
                      {availableDates.map((date, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`px-3 py-2 text-sm rounded-md ${
                            bookingInfo.departureDate === date.date ? 
                            'bg-blue-600 text-white' : 
                            'border border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleDateSelect(date.date)}
                        >
                          {date.date.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1.$2.$3")} ({date.day})
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {packageData.departure} (추천 출발일 선택)
                    </p>
                  </div>

                  {/* 숙박 기간 선택 (국내 호텔/리조트/풀빌라/펜션만) */}
                  {packageData.type === 'domestic' && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">숙박 기간</p>
                      <div className="grid grid-cols-2 gap-4">
                        {/* 박수 선택 */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">몇 박</label>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleNightsChange(bookingInfo.nights - 1)}
                              className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
                              disabled={bookingInfo.nights <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={bookingInfo.nights}
                              onChange={(e) => handleNightsChange(parseInt(e.target.value) || 1)}
                              className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center"
                              min="1"
                              max="30"
                            />
                            <button
                              type="button"
                              onClick={() => handleNightsChange(bookingInfo.nights + 1)}
                              className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
                              disabled={bookingInfo.nights >= 30}
                            >
                              +
                            </button>
                            <span className="ml-2 text-sm text-gray-600">박</span>
                          </div>
                        </div>

                        {/* 일수 표시 */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">총 일수</label>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700">
                            {bookingInfo.nights + 1}일
                          </div>
                        </div>
                      </div>

                      {/* 체크인/체크아웃 날짜 표시 */}
                      {bookingInfo.departureDate && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <div className="flex justify-between text-sm">
                            <div>
                              <span className="font-medium text-gray-700">체크인:</span>
                              <span className="ml-2 text-blue-700">
                                {new Date(bookingInfo.departureDate).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'short'
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">체크아웃:</span>
                              <span className="ml-2 text-blue-700">
                                {bookingInfo.checkoutDate && new Date(bookingInfo.checkoutDate).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'short'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              {bookingInfo.nights}박 {bookingInfo.nights + 1}일
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 인원수 선택 (해외여행만) */}
                  {!(packageData.type === 'domestic' && 
                    (packageData.category === 'domestic-hotel' || 
                     packageData.category === 'domestic-resort' || 
                     packageData.category === 'domestic-pool-villa' || 
                     packageData.category === 'domestic-pension')) && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-gray-700 mb-3">여행 인원</p>
                      <div className="grid grid-cols-1 gap-4">
                        {/* 인원수 선택 */}
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">여행자 수</label>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleTravelerCountChange(bookingInfo.travelerCount - 1)}
                              className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-50"
                              disabled={bookingInfo.travelerCount <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={bookingInfo.travelerCount}
                              onChange={(e) => handleTravelerCountChange(parseInt(e.target.value) || 1)}
                              className="w-16 px-3 py-2 border-t border-b border-gray-300 text-center"
                              min="1"
                              max="10"
                            />
                            <button
                              type="button"
                              onClick={() => handleTravelerCountChange(bookingInfo.travelerCount + 1)}
                              className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-50"
                              disabled={bookingInfo.travelerCount >= 10}
                            >
                              +
                            </button>
                            <span className="ml-2 text-sm text-gray-600">명</span>
                          </div>
                        </div>

                        {/* 인원 정보 표시 */}
                        <div>
                          <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-700">
                            성인 {bookingInfo.travelerCount}명
                          </div>
                        </div>
                      </div>

                      {/* 여행 인원 정보 표시 */}
                      {bookingInfo.departureDate && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <div className="flex justify-between text-sm">
                            <div>
                              <span className="font-medium text-gray-700">출발일:</span>
                              <span className="ml-2 text-blue-700">
                                {new Date(bookingInfo.departureDate).toLocaleDateString('ko-KR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  weekday: 'short'
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">여행자:</span>
                              <span className="ml-2 text-blue-700">
                                {bookingInfo.travelerCount}명
                              </span>
                            </div>
                          </div>
                          <div className="text-center mt-2">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                              총 {bookingInfo.travelerCount}명 여행
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* 여행자 정보 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection("travelerInfo")}
              >
                <h2 className="text-xl font-semibold flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  여행자 정보
                </h2>
                {openSection === "travelerInfo" ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {openSection === "travelerInfo" && (
                <div className="px-6 pb-6 border-t pt-4">
                  {/* 여행자 수 선택 - 해외여행만 */}
                  {!(packageData.type === 'domestic' && 
                    (packageData.category === 'domestic-hotel' || 
                     packageData.category === 'domestic-resort' || 
                     packageData.category === 'domestic-pool-villa' || 
                     packageData.category === 'domestic-pension')) && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        여행자 수
                      </label>
                      <div className="flex items-center">
                        <button 
                          type="button"
                          className="w-10 h-10 bg-gray-100 rounded-l-lg flex items-center justify-center hover:bg-gray-200"
                          onClick={() => handleTravelerCountChange(bookingInfo.travelerCount - 1)}
                        >
                          <span className="text-xl">-</span>
                        </button>
                        <span className="w-12 h-10 flex items-center justify-center border-t border-b">
                          {bookingInfo.travelerCount}
                        </span>
                        <button 
                          type="button"
                          className="w-10 h-10 bg-gray-100 rounded-r-lg flex items-center justify-center hover:bg-gray-200"
                          onClick={() => handleTravelerCountChange(bookingInfo.travelerCount + 1)}
                        >
                          <span className="text-xl">+</span>
                        </button>
                        <span className="ml-2 text-sm text-gray-600">명</span>
                      </div>
                    </div>
                  )}
                  
                  {/* 예약자 정보 입력 폼 (1명만) */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">예약자 정보</h3>
                    <p className="text-sm text-gray-600 mb-4">대표 예약자의 정보를 입력해주세요. 모든 여행자를 대표하여 예약하게 됩니다.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          이름 <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text"
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="여권 상의 이름 (예: 홍길동)"
                          value={bookingInfo.travelers[0]?.name || ''}
                          onChange={(e) => handleTravelerChange(0, 'name', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          생년월일 <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date"
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          value={bookingInfo.travelers[0]?.birthdate || ''}
                          onChange={(e) => handleTravelerChange(0, 'birthdate', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          성별 <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          value={bookingInfo.travelers[0]?.gender || ''}
                          onChange={(e) => handleTravelerChange(0, 'gender', e.target.value)}
                          required
                        >
                          <option value="">선택</option>
                          <option value="male">남성</option>
                          <option value="female">여성</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          휴대폰 번호 <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="tel"
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="연락 가능한 번호 (예: 010-1234-5678)"
                          value={bookingInfo.travelers[0]?.phone || ''}
                          onChange={(e) => handleTravelerChange(0, 'phone', e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          이메일 <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email"
                          className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                          placeholder="예약 확인 및 알림을 받을 이메일"
                          value={bookingInfo.travelers[0]?.email || ''}
                          onChange={(e) => handleTravelerChange(0, 'email', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 특별 요청 사항 */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      특별 요청 사항 (선택)
                    </label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="식사, 객실 등 특별한 요청 사항이 있으시면 입력해주세요."
                      rows={3}
                      value={bookingInfo.specialRequests}
                      onChange={(e) => handleSpecialRequestsChange(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            
            {/* 결제 정보 섹션 */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="flex justify-between items-center p-6 cursor-pointer"
                onClick={() => toggleSection("paymentInfo")}
              >
                <h2 className="text-xl font-semibold flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  결제 정보
                </h2>
                {openSection === "paymentInfo" ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              
              {openSection === "paymentInfo" && (
                <div className="px-6 pb-6 border-t pt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        결제 방법
                      </label>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">무통장 입금</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">
                          {siteSettings.paymentInstruction}
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200 mb-2">
                          <p className="font-medium text-gray-800">{bookingInfo.bankAccount}</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {siteSettings.paymentConfirmationTime}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <div className="flex items-center">
                        <input 
                          type="checkbox"
                          id="agreeTerms"
                          checked={bookingInfo.agreeTerms}
                          onChange={(e) => handleAgreeTermsChange(e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
                          <span className="text-red-500">*</span> 이용약관, 개인정보 처리방침, 취소 및 환불 정책에 동의합니다.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 사이드바 - 예약 요약 */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
                <h2 className="text-xl font-semibold">예약 요약</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{packageData.title}</h3>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>여행 기간</span>
                      <span>{packageData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>출발일</span>
                      <span>{bookingInfo.departureDate ? `${bookingInfo.departureDate.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1.$2.$3")}` : "선택 필요"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>기본 가격 ({packageData.type === 'domestic' && 
                       (packageData.category === 'domestic-hotel' || 
                        packageData.category === 'domestic-resort' || 
                        packageData.category === 'domestic-pool-villa' || 
                        packageData.category === 'domestic-pension') ? 
                        '1박' : '1인'})</span>
                    <span>{packageData.price}원</span>
                  </div>
                  {packageData.type === 'domestic' && 
                   (packageData.category === 'domestic-hotel' || 
                    packageData.category === 'domestic-resort' || 
                    packageData.category === 'domestic-pool-villa' || 
                    packageData.category === 'domestic-pension') ? (
                    <div className="flex justify-between mb-1 text-sm">
                      <span>숙박 기간</span>
                      <span>{bookingInfo.nights}박</span>
                    </div>
                  ) : (
                    <div className="flex justify-between mb-1 text-sm">
                      <span>인원</span>
                      <span>{bookingInfo.travelerCount}명</span>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-1 font-medium">
                    <span>총 결제금액</span>
                    <span className="text-xl font-bold text-blue-700">{formatPrice(calculateTotalAmount())}</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    부가세 포함
                  </div>
                </div>
                
                <button
                  type="button"
                  className={`w-full ${
                    bookingInfo.agreeTerms ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  } text-white py-3 rounded-lg font-medium transition-colors`}
                  onClick={handleBookingSubmit}
                  disabled={!bookingInfo.agreeTerms}
                >
                  {action === 'payment' ? '결제하기' : '예약하기'}
                </button>
                
                <div className="mt-4 border border-blue-100 rounded-lg bg-blue-50 p-3">
                  <div className="flex items-start">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                    <div className="text-xs text-blue-800">
                      <p>예약 시 유의사항을 확인해 주세요.</p>
                    </div>
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
