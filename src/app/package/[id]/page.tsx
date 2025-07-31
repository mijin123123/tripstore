'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Calendar, Users, Star, Clock, Plane, CheckCircle, Coffee, Utensils, HelpCircle, CreditCard } from 'lucide-react'
import { Package } from '@/types'
import { getPackageById } from '@/lib/api'
import MarkdownImage from '@/components/MarkdownImage'

// 패키지 상세 페이지 컴포넌트
export default function PackageDetail() {
  // 이미지 경로를 실제 존재하는 이미지로 매핑하는 함수
  const getValidImagePath = (imagePath: string = '', type: string = '', region: string = '') => {
    console.log('getValidImagePath 호출됨:', { imagePath: imagePath?.substring(0, 50) + (imagePath?.length > 50 ? '...' : ''), type, region });
    
    // Base64 이미지인 경우 그대로 사용
    if (imagePath && imagePath.startsWith('data:image/')) {
      console.log('Base64 이미지 사용:', imagePath.substring(0, 50) + '...');
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

  // 필요한 모든 상태들을 한 번에 정의
  const params = useParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [selectedPeople, setSelectedPeople] = useState<number>(2); // 국내 숙박은 기본 2명
  const [selectedNights, setSelectedNights] = useState<number>(1); // 숙박 박수 추가
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [packageImages, setPackageImages] = useState<string[]>(['/images/hotel-hero.jpg']);
  const [isItineraryExpanded, setIsItineraryExpanded] = useState<boolean>(false); // 기본값은 접힌 상태
  
  // 패키지에 포함된 추천 출발일
  const availableDates = [
    { date: '2025-08-05', day: '화' },
    { date: '2025-08-08', day: '금' },
    { date: '2025-08-12', day: '화' },
    { date: '2025-08-15', day: '금' },
    { date: '2025-08-19', day: '화' }
  ];
  
  // 패키지 데이터 로딩
  useEffect(() => {
    async function loadPackageData() {
      if (params?.id) {
        try {
          const id = params.id as string;
          console.log('패키지 ID로 데이터 로드:', id);
          
          // API를 통해 패키지 데이터 가져오기
          const response = await fetch(`/api/packages/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const packageInfo = await response.json();
          console.log('로드된 패키지 정보:', packageInfo);
          console.log('패키지 타입 및 카테고리:', {
            type: packageInfo?.type,
            category: packageInfo?.category,
            isDomestic: packageInfo?.type === 'domestic',
            isAccommodation: ['domestic-hotel', 'domestic-resort', 'domestic-pool-villa', 'domestic-pension'].includes(packageInfo?.category)
          });
          console.log('여행 일정 데이터:', {
            itinerary: packageInfo?.itinerary,
            itineraryType: typeof packageInfo?.itinerary,
            itineraryLength: Array.isArray(packageInfo?.itinerary) ? packageInfo.itinerary.length : 'Not an array'
          });
          
          setPackageData(packageInfo);
          
          // 패키지 이미지 처리 - 업로드한 이미지들만 사용
          if (packageInfo) {
            const images: string[] = [];
            
            console.log('패키지 이미지 정보:', {
              images: packageInfo.images,
              type: packageInfo.type,
              region: packageInfo.region
            });
            
            // 업로드한 이미지들만 추가 (images 배열에서)
            if (packageInfo.images && Array.isArray(packageInfo.images) && packageInfo.images.length > 0) {
              console.log('업로드된 이미지 배열 처리 시작:', packageInfo.images);
              packageInfo.images.forEach((img: any, index: number) => {
                if (typeof img === 'string' && img.trim() !== '') {
                  const mappedImage = getValidImagePath(img, packageInfo.type || '', packageInfo.region || '');
                  console.log(`추가된 이미지 ${index + 1}:`, mappedImage.substring(0, 50) + (mappedImage.length > 50 ? '...' : ''));
                  images.push(mappedImage);
                }
              });
            } else {
              console.log('업로드된 이미지가 없음 - 기본 이미지 사용');
            }
            
            // 이미지가 없으면 기본 이미지 사용
            const finalImages = images.length > 0 ? images : [getValidImagePath('', packageInfo.type || '', packageInfo.region || '')];
            console.log('최종 이미지 배열:', finalImages.map(img => img.substring(0, 50) + (img.length > 50 ? '...' : '')));
            console.log('총 이미지 개수:', finalImages.length);
            setPackageImages(finalImages);
          }
        } catch (error) {
          console.error('패키지 데이터를 불러오는 중 오류 발생:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    loadPackageData();
  }, [params]);

  // 이미지 슬라이더 제어 함수
  const nextImage = () => {
    if (packageImages.length > 1) {
      setCurrentImageIndex(prev => (prev + 1) % packageImages.length);
    }
  };
  
  const prevImage = () => {
    if (packageImages.length > 1) {
      setCurrentImageIndex(prev => (prev - 1 + packageImages.length) % packageImages.length);
    }
  };
  
  // 링크 생성 함수
  const getBackLink = () => {
    if (packageData?.type && packageData?.region) {
      return `/${packageData.type}/${packageData.region}`;
    }
    return '/';
  };

  // 가격 관련 유틸리티 함수들
  const formatPrice = (price: number) => {
    return price.toLocaleString('ko-KR');
  };

  const calculateTotalPrice = () => {
    if (!packageData) return 0;
    const basePrice = typeof packageData.price === 'number' 
      ? packageData.price 
      : parseInt(String(packageData.price).replace(/,/g, ''));
    
    // 임시로 모든 상품을 박수 기준으로 계산
    console.log('가격 계산:', {
      basePrice,
      selectedNights,
      total: basePrice * selectedNights
    });
    
    return basePrice * selectedNights;
  };

  // 로딩 중 상태 표시
  if (isLoading) {
    return (
      <div className='min-h-screen pt-20 flex items-center justify-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  // 데이터 없음 상태 표시
  if (!packageData) {
    return (
      <div className='min-h-screen pt-20'>
        <div className='max-w-6xl mx-auto px-4 py-16 text-center'>
          <HelpCircle className='w-16 h-16 mx-auto text-red-500 mb-4' />
          <h1 className='text-3xl font-bold mb-4'>패키지를 찾을 수 없습니다</h1>
          <p className='mb-8 text-gray-600'>요청하신 패키지 정보를 찾을 수 없습니다. 다른 패키지를 선택해주세요.</p>
          <Link href='/' className='btn btn-primary'>
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-20'>
      
      {/* 헤더 섹션 - 간소화된 이미지 슬라이더 */}
      <section className='relative h-96'>
        {/* 현재 이미지 제한 안내 */}
        {packageImages.length === 1 && packageData?.image && packageData.image.startsWith('data:image/') && (
          <div className='absolute top-4 right-4 z-20 bg-blue-600 text-white text-xs px-3 py-1 rounded-full'>
            업로드된 이미지 표시 중
          </div>
        )}
        
        {/* 단일 이미지 표시 */}
        <div 
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{ 
            backgroundImage: `url(${packageImages[currentImageIndex] || '/images/hotel-hero.jpg'})` 
          }}
          onError={(e) => {
            console.log('배경 이미지 로드 실패');
            // 배경 이미지 실패시 기본 이미지로 변경
            (e.target as HTMLElement).style.backgroundImage = 'url(/images/hotel-hero.jpg)';
          }}
        />
        
        <div className='absolute inset-0 bg-black/50'></div>
        
        {/* 이미지가 여러 개일 경우에만 네비게이션 버튼 표시 */}
        {packageImages.length > 1 && (
          <>
            <button 
              onClick={prevImage} 
              className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white z-10'
              aria-label='이전 이미지'
            >
              &lt;
            </button>
            <button 
              onClick={nextImage} 
              className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 text-white z-10'
              aria-label='다음 이미지'
            >
              &gt;
            </button>
            {/* 이미지 인디케이터 */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10'>
              <span className='text-white text-sm bg-black/50 px-2 py-1 rounded'>
                {currentImageIndex + 1} / {packageImages.length}
              </span>
            </div>
          </>
        )}
        <div className='relative max-w-6xl mx-auto px-4 h-full flex items-center'>
          <div className='text-white'>
            <div className='mb-4'>
              <Link href={getBackLink()} className='text-blue-200 hover:text-white transition-colors flex items-center gap-1'>
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                </svg>
                {packageData.regionKo} 여행 패키지 목록으로
              </Link>
            </div>
            <h1 className='text-4xl md:text-5xl font-bold mb-4'>{packageData.title || packageData.name}</h1>
            <p className='text-xl mb-6 max-w-3xl'>
              {packageData.description ? packageData.description.split('.')[0] + '.' : '패키지 상세 정보가 준비 중입니다.'}
            </p>
            <div className='flex items-center gap-4 text-sm flex-wrap'>
              <span className='flex items-center gap-1'>
                <MapPin className='w-4 h-4' />
                {packageData.regionKo}
              </span>
              <span className='flex items-center gap-1'>
                <Clock className='w-4 h-4' />
                {packageData.duration}
              </span>
              <span className='flex items-center gap-1'>
                <Plane className='w-4 h-4' />
                {packageData.departure}
              </span>
              <span className='flex items-center gap-1'>
                <Star className='w-4 h-4 text-yellow-400 fill-current' />
                {packageData.rating} 고객 평점
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 메인 콘텐츠 */}
          <div className='lg:col-span-2'>
            {/* 패키지 설명 */}
            <section className='bg-white rounded-xl shadow-md p-6 mb-8'>
              {/* 여행 대표 이미지 - 이미지 슬라이더 */}
              <div className='mb-6 overflow-hidden rounded-lg relative'>
                {packageImages.length > 1 ? (
                  // 여러 이미지가 있을 경우 슬라이더
                  <div className='relative'>
                    <img 
                      src={packageImages[currentImageIndex] || '/images/hotel-hero.jpg'}
                      alt={`${packageData.title || packageData.name || '여행 패키지'} - 이미지 ${currentImageIndex + 1}`}
                      className='w-full h-64 object-cover'
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        console.log('콘텐츠 이미지 로드 실패, 기본 이미지로 변경');
                        const target = e.target as HTMLImageElement;
                        // 이미 기본 이미지인 경우 재시도하지 않음
                        if (!target.src.includes('/images/hotel-hero.jpg')) {
                          target.src = '/images/hotel-hero.jpg';
                        }
                      }}
                      onLoad={() => {
                        console.log('콘텐츠 이미지 로드 성공:', packageImages[currentImageIndex]);
                      }}
                    />
                    
                    {/* 이미지 네비게이션 버튼 */}
                    <button 
                      onClick={prevImage} 
                      className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white z-10'
                      aria-label='이전 이미지'
                    >
                      &lt;
                    </button>
                    <button 
                      onClick={nextImage} 
                      className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white z-10'
                      aria-label='다음 이미지'
                    >
                      &gt;
                    </button>
                    
                    {/* 이미지 인디케이터 */}
                    <div className='absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded'>
                      {currentImageIndex + 1} / {packageImages.length}
                    </div>
                    
                    {/* 이미지 점 인디케이터 */}
                    <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1'>
                      {packageImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`이미지 ${index + 1}로 이동`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // 이미지가 하나일 경우
                  <img 
                    src={packageImages[0] || '/images/hotel-hero.jpg'}
                    alt={packageData.title || packageData.name || '여행 패키지'} 
                    className='w-full h-64 object-cover'
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      console.log('단일 이미지 로드 실패, 기본 이미지로 변경');
                      (e.target as HTMLImageElement).src = '/images/hotel-hero.jpg';
                    }}
                    onLoad={() => {
                      console.log('단일 이미지 로드 성공:', packageImages[0]);
                    }}
                  />
                )}
              </div>
              
              <h2 className='text-2xl font-bold mb-4'>여행 소개</h2>
              <p className='text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap'>
                {packageData.description}
              </p>
            </section>

            {/* 일정 */}
            <section className='bg-white rounded-xl shadow-md p-6 mb-8'>
              <div className='flex justify-between items-center mb-6'>
                <h2 className='text-2xl font-bold'>상세 일정</h2>
                <button 
                  onClick={() => setIsItineraryExpanded(!isItineraryExpanded)}
                  className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'
                  aria-label={isItineraryExpanded ? '접기' : '펼치기'}
                >
                  <span className='mr-2 text-sm'>{isItineraryExpanded ? '접기' : '펼치기'}</span>
                  {isItineraryExpanded ? (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                      <path fillRule='evenodd' d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z' clipRule='evenodd' />
                    </svg>
                  ) : (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                      <path fillRule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clipRule='evenodd' />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className={`space-y-6 transition-all duration-300 ease-in-out overflow-hidden ${isItineraryExpanded ? 'max-h-full opacity-100' : 'max-h-0 opacity-0'}`}>
                {packageData.itinerary && Array.isArray(packageData.itinerary) && packageData.itinerary.length > 0 ? (
                  packageData.itinerary.map((day, index) => (
                    <div key={day.day || index} className='border-l-4 border-blue-500 pl-4 pb-6'>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold'>
                          {day.day}
                        </div>
                        {day.title && (
                          <h3 className='text-xl font-semibold'>{day.title}</h3>
                        )}
                      </div>
                      <p className='text-gray-700 mb-3 whitespace-pre-wrap'>{day.description || '일정 상세 내용이 준비 중입니다.'}</p>
                      
                      <div className='flex flex-wrap gap-4 items-center mt-3'>
                        {day.accommodation && (
                          <div className='flex items-center'>
                            <span className='text-sm text-gray-500'>숙박:</span>
                            <span className='ml-2 text-sm font-medium'>{day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-500'>식사:</span>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${day.meals.breakfast ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
                              <Coffee className='w-3 h-3 mr-1' /> 조식
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${day.meals.lunch ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                              <Utensils className='w-3 h-3 mr-1' /> 중식
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${day.meals.dinner ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                              <Utensils className='w-3 h-3 mr-1' /> 석식
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : typeof packageData.itinerary === 'string' && packageData.itinerary.trim() ? (
                  // 문자열 형태의 일정 처리
                  <div className='bg-gray-50 rounded-lg p-6'>
                    <div className='flex items-start gap-3'>
                      <Calendar className='w-6 h-6 text-blue-500 mt-1 flex-shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-lg font-semibold mb-3'>여행 일정</h3>
                        <div className='text-gray-700 leading-relaxed prose prose-sm max-w-none'>
                          {/* 마크다운 이미지 렌더링 컴포넌트 사용 */}
                          <MarkdownImage markdown={packageData.itinerary} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='text-center py-8'>
                    <div className='mb-4'>
                      <Calendar className='w-12 h-12 text-gray-400 mx-auto' />
                    </div>
                    <p className='text-gray-500 text-lg'>상세 일정 정보가 준비 중입니다.</p>
                    <p className='text-gray-400 text-sm mt-2'>곧 업데이트될 예정입니다.</p>
                  </div>
                )}
              </div>
              
              {/* 접힌 상태에서 보여줄 간략한 정보 */}
              {!isItineraryExpanded && (
                <div className='mt-2 p-4 bg-gray-50 rounded-lg text-center cursor-pointer' onClick={() => setIsItineraryExpanded(true)}>
                  <p className='text-blue-600'>클릭하여 상세 일정 보기</p>
                  <p className='text-sm text-gray-500 mt-1'>{packageData.duration} 일정의 세부 정보를 확인하세요</p>
                </div>
              )}
            </section>

            {/* 포함/불포함 사항 */}
            <section className='bg-white rounded-xl shadow-md p-6 mb-8'>
              <h2 className='text-2xl font-bold mb-6'>포함/불포함 사항</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* 포함 사항 */}
                <div>
                  <h3 className='text-lg font-semibold text-green-700 mb-4 flex items-center'>
                    <CheckCircle className='w-5 h-5 mr-2' />
                    포함 사항
                  </h3>
                  {packageData.included && Array.isArray(packageData.included) && packageData.included.length > 0 ? (
                    <ul className='space-y-2'>
                      {packageData.included.map((item, index) => (
                        <li key={index} className='flex items-start gap-2 text-gray-700'>
                          <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-gray-500'>포함 사항 정보가 준비 중입니다.</p>
                  )}
                </div>

                {/* 불포함 사항 */}
                <div>
                  <h3 className='text-lg font-semibold text-red-700 mb-4 flex items-center'>
                    <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                    </svg>
                    불포함 사항
                  </h3>
                  {packageData.excluded && Array.isArray(packageData.excluded) && packageData.excluded.length > 0 ? (
                    <ul className='space-y-2'>
                      {packageData.excluded.map((item, index) => (
                        <li key={index} className='flex items-start gap-2 text-gray-700'>
                          <svg className='w-4 h-4 text-red-500 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-gray-500'>불포함 사항 정보가 준비 중입니다.</p>
                  )}
                </div>
              </div>
            </section>

            {/* 주의사항 */}
            <section className='bg-white rounded-xl shadow-md p-6 mb-8'>
              <h2 className='text-2xl font-bold mb-6 flex items-center'>
                <HelpCircle className='w-6 h-6 mr-2 text-amber-500' />
                주의사항
              </h2>
              {packageData.notes && Array.isArray(packageData.notes) && packageData.notes.length > 0 ? (
                <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
                  <ul className='space-y-3'>
                    {packageData.notes.map((note, index) => (
                      <li key={index} className='flex items-start gap-3 text-gray-700'>
                        <div className='w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0'></div>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                  <p className='text-gray-500'>주의사항 정보가 준비 중입니다.</p>
                </div>
              )}
            </section>
          </div>

          {/* 사이드바 - 예약 박스 */}
          <div className='lg:sticky lg:top-24 h-fit'>
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white'>
                <h3 className='text-xl font-bold'>예약하기</h3>
              </div>
              
              <div className='p-5'>
                <div className='mb-5'>
                  <div className='flex justify-between items-center mb-1'>
                    <span className='text-gray-600'>가격</span>
                    <span className='text-xl font-bold text-blue-600'>
                      {formatPrice(typeof packageData.price === 'number' ? 
                        packageData.price : 
                        parseInt(String(packageData.price).replace(/,/g, '')))}원
                    </span>
                  </div>
                  <div className='flex justify-between items-center text-xs text-gray-500'>
                    <span>
                      1박 기준
                    </span>
                  </div>
                </div>
                
                <div className='space-y-2'>
                  <button 
                    className='w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm'
                    onClick={() => router.push(`/booking/${packageData.id}?action=reserve`)}
                  >
                    예약하기
                  </button>
                  <button 
                    className='w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex justify-center items-center text-sm'
                    onClick={() => router.push(`/booking/${packageData.id}?action=payment`)}
                  >
                    <CreditCard className='w-4 h-4 mr-1' />
                    바로결제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}