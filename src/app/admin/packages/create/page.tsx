'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import Link from 'next/link'

export default function CreatePackage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState<number[]>([])

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: '',
    region: '',
    regionKo: '',
    description: '',
    image: '',
    images: [''], // 여러 이미지를 위한 배열
    highlights: [''],
    departure: '',
    type: '',
    min_people: 1,
    max_people: 10,
    itinerary: '',
    included: [''],
    excluded: [''],
    notes: [''],
    is_featured: false,
    location: '',
    category: ''
  })

  // 숫자를 천 단위 콤마 형식으로 변환하는 함수
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR')
  }

  // 이미지 파일을 Base64로 변환하는 함수
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 이미지 및 웹 콘텐츠 붙여넣기 핸들러
  const handleItineraryPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    console.log('붙여넣기 이벤트 감지됨');
    const items = e.clipboardData.items;
    const types = e.clipboardData.types;
    console.log('클립보드 항목 수:', items.length);
    console.log('클립보드 타입:', types);
    
    // 클립보드 항목 유형 로깅
    for (let i = 0; i < items.length; i++) {
      console.log(`항목 ${i} 유형:`, items[i].type);
    }
    
    // HTML 콘텐츠가 있는지 확인 (드래그하여 복사한 웹 콘텐츠)
    if (types.includes('text/html')) {
      console.log('HTML 콘텐츠 감지됨');
      e.preventDefault();
      
      try {
        // HTML 콘텐츠 가져오기
        const html = e.clipboardData.getData('text/html');
        console.log('HTML 콘텐츠 길이:', html.length);
        
        // HTML에서 이미지 태그 찾기
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        const images: string[] = [];
        let match;
        
        while ((match = imgRegex.exec(html)) !== null) {
          if (match[1]) {
            images.push(match[1]);
          }
        }
        
        console.log('찾은 이미지 수:', images.length);
        
        // 일반 텍스트 내용 가져오기 (이미지가 없거나 텍스트도 함께 처리할 경우)
        let text = e.clipboardData.getData('text/plain');
        
        // textarea 요소와 커서 위치 확인
        const textarea = e.currentTarget;
        const startPos = textarea?.selectionStart || 0;
        const endPos = textarea?.selectionEnd || startPos || 0;
        const beforeText = formData.itinerary.substring(0, startPos);
        const afterText = formData.itinerary.substring(endPos);
        
        // 이미지가 있다면 마크다운 형식으로 추가
        if (images.length > 0) {
          let newContent = text || '';
          
          // 드래그한 이미지는 일반적으로 절대 URL이므로 그대로 사용
          for (const imgSrc of images) {
            // 마크다운 이미지 형식으로 추가
            newContent += `\n![이미지](${imgSrc})\n`;
          }
          
          const newItinerary = beforeText + newContent + afterText;
          handleItineraryChange(newItinerary);
          console.log('HTML 콘텐츠와 이미지가 성공적으로 추가되었습니다.');
        } else {
          // 이미지가 없는 경우 일반 텍스트로 처리
          const newItinerary = beforeText + text + afterText;
          handleItineraryChange(newItinerary);
          console.log('HTML에서 추출한 텍스트 콘텐츠가 추가되었습니다.');
        }
        
        return; // HTML 처리 후 종료
      } catch (error) {
        console.error('HTML 콘텐츠 처리 실패:', error);
        // HTML 처리 실패 시 기본 붙여넣기 동작 허용
      }
    }
    
    // 이미지 처리 (스크린샷 등 직접 이미지 복사 시)
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        console.log('이미지 항목 감지됨:', item.type);
        e.preventDefault();
        
        try {
          const file = item.getAsFile();
          if (file) {
            console.log('이미지 파일 크기:', file.size, 'bytes');
            const base64 = await convertToBase64(file);
            console.log('Base64 변환 완료, 길이:', base64.length);
            const imageMarkdown = `![이미지](${base64})`;
            
            // textarea 요소가 존재하는지 확인
            const textarea = e.currentTarget;
            if (!textarea) {
              // textarea가 없으면 단순히 끝에 추가
              const newItinerary = formData.itinerary + imageMarkdown;
              handleItineraryChange(newItinerary);
              console.log('텍스트영역을 찾을 수 없어 이미지를 끝에 추가했습니다.');
              return;
            }
            
            try {
              // 안전하게 선택 위치 확인
              const startPos = textarea.selectionStart || 0;
              const endPos = textarea.selectionEnd || startPos || 0;
              const beforeText = formData.itinerary.substring(0, startPos);
              const afterText = formData.itinerary.substring(endPos);
              
              const newItinerary = beforeText + imageMarkdown + afterText;
              handleItineraryChange(newItinerary);
              console.log('이미지가 성공적으로 추가되었습니다.');
              
              // 커서 위치 조정 (안전하게)
              setTimeout(() => {
                try {
                  if (textarea && typeof textarea.selectionStart !== 'undefined') {
                    textarea.selectionStart = textarea.selectionEnd = startPos + imageMarkdown.length;
                    textarea.focus();
                  }
                } catch (err) {
                  console.log('커서 위치를 조정하는 중 오류 발생:', err);
                }
              }, 0);
            } catch (selectionError) {
              console.error('선택 위치 접근 오류:', selectionError);
              // 오류가 발생하면 그냥 끝에 추가
              const newItinerary = formData.itinerary + imageMarkdown;
              handleItineraryChange(newItinerary);
            }
          }
        } catch (error) {
          console.error('이미지 변환 실패:', error);
          alert('이미지 처리 중 오류가 발생했습니다.');
        }
        break;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name === 'price') {
      // 콤마 제거 후 숫자만 추출
      const numericValue = value.replace(/[^\d]/g, '')
      setFormData({ ...formData, [name]: parseInt(numericValue) || 0 })
    } else if (name === 'min_people' || name === 'max_people') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else if (name === 'category') {
      // 카테고리 변경 시 type과 region 자동 설정
      let newType = '';
      let newRegion = '';
      let newRegionKo = '';
      
      if (value === 'overseas-europe') {
        newType = 'overseas';
        newRegion = 'europe';
        newRegionKo = '유럽';
      } else if (value === 'overseas-japan') {
        newType = 'overseas';
        newRegion = 'japan';
        newRegionKo = '일본';
      } else if (value === 'overseas-southeast-asia') {
        newType = 'overseas';
        newRegion = 'southeast-asia';
        newRegionKo = '동남아';
      } else if (value === 'overseas-americas') {
        newType = 'overseas';
        newRegion = 'americas';
        newRegionKo = '미주/캐나다/하와이';
      } else if (value === 'overseas-taiwan-hongkong-macau') {
        newType = 'overseas';
        newRegion = 'taiwan-hongkong-macau';
        newRegionKo = '대만/홍콩/마카오';
      } else if (value === 'overseas-guam-saipan') {
        newType = 'overseas';
        newRegion = 'guam-saipan';
        newRegionKo = '괌/사이판';
      } else if (value === 'domestic-hotel') {
        newType = 'domestic';
        newRegion = 'hotel';
        newRegionKo = '호텔/리조트';
      } else if (value === 'domestic-pool-villa') {
        newType = 'domestic';
        newRegion = 'pool-villa';
        newRegionKo = '풀빌라/펜션';
      } else if (value === 'luxury-europe') {
        newType = 'luxury';
        newRegion = 'europe';
        newRegionKo = '유럽';
      } else if (value === 'luxury-japan') {
        newType = 'luxury';
        newRegion = 'japan';
        newRegionKo = '일본';
      } else if (value === 'luxury-southeast-asia') {
        newType = 'luxury';
        newRegion = 'southeast-asia';
        newRegionKo = '동남아';
      } else if (value === 'luxury-cruise') {
        newType = 'luxury';
        newRegion = 'cruise';
        newRegionKo = '크루즈';
      } else if (value === 'luxury-special-theme') {
        newType = 'luxury';
        newRegion = 'special-theme';
        newRegionKo = '이색테마';
      }
      
      setFormData({ 
        ...formData, 
        [name]: value,
        type: newType,
        region: newRegion,
        regionKo: newRegionKo
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleItineraryChange = (value: string) => {
    setFormData({ ...formData, itinerary: value })
  }

  const addArrayItem = (fieldName: keyof typeof formData) => {
    const currentArray = formData[fieldName] as string[]
    setFormData({
      ...formData,
      [fieldName]: [...currentArray, '']
    })
  }

  const removeArrayItem = (fieldName: keyof typeof formData, index: number) => {
    const currentArray = formData[fieldName] as string[]
    const newArray = currentArray.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      [fieldName]: newArray
    })
  }

  const updateArrayItem = (fieldName: keyof typeof formData, index: number, value: string) => {
    const currentArray = formData[fieldName] as string[]
    const newArray = [...currentArray]
    newArray[index] = value
    setFormData({
      ...formData,
      [fieldName]: newArray
    })
  }

  const uploadImage = async (file: File, index: number): Promise<string> => {
    setUploadingImages(prev => [...prev, index])
    
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `packages/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('hero-images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      throw error
    } finally {
      setUploadingImages(prev => prev.filter(i => i !== index))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const imageUrl = await uploadImage(file, index)
      
      if (index === -1) {
        // 대표 이미지 업로드
        setFormData({ ...formData, image: imageUrl })
      } else {
        // 추가 이미지 업로드
        const newImages = [...formData.images]
        newImages[index] = imageUrl
        setFormData({ ...formData, images: newImages })
      }
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // 현재 이미지 개수와 새로 업로드할 이미지 개수를 확인하여 10개 제한
    const currentImageCount = formData.images.filter(img => img.trim() !== '').length
    const filesToUpload = Array.from(files).slice(0, 10 - currentImageCount)
    
    if (filesToUpload.length < files.length) {
      alert(`최대 10장까지만 업로드할 수 있습니다. ${filesToUpload.length}장만 업로드됩니다.`)
    }

    try {
      // 필요한 만큼 빈 슬롯 추가
      const newImages = [...formData.images]
      while (newImages.length < currentImageCount + filesToUpload.length) {
        newImages.push('')
      }
      
      setFormData({ ...formData, images: newImages })

      // 각 파일을 순차적으로 업로드
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        const targetIndex = currentImageCount + i
        
        try {
          const imageUrl = await uploadImage(file, targetIndex)
          
          setFormData(prevData => {
            const updatedImages = [...prevData.images]
            updatedImages[targetIndex] = imageUrl
            return { ...prevData, images: updatedImages }
          })
        } catch (error) {
          console.error(`이미지 ${i + 1} 업로드 실패:`, error)
        }
      }
    } catch (error) {
      console.error('다중 이미지 업로드 실패:', error)
      alert('이미지 업로드 중 오류가 발생했습니다.')
    }

    // 파일 입력 초기화
    e.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      // 최소한의 필수 필드만 검증 (이름과 카테고리)
      if (!formData.name) {
        throw new Error('패키지 이름은 필수입니다.')
      }
      
      const supabase = createClient()
      
      // 빈 이미지 URL 제거
      const validImages = formData.images.filter(img => img.trim() !== '')
      
      // 빈 항목들 제거
      const validHighlights = formData.highlights.filter(item => item.trim() !== '')
      const validIncluded = formData.included.filter(item => item.trim() !== '')
      const validExcluded = formData.excluded.filter(item => item.trim() !== '')
      const validNotes = formData.notes.filter(item => item.trim() !== '')

      // 패키지 ID 생성 (현재 시간 기반)
      const packageId = `pkg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

      // JSONB 타입 필드를 위해 배열 데이터를 JSON 형식으로 변환
      // 빈 필드에 기본값 설정
      const defaultImage = 'https://placehold.co/600x400?text=여행+패키지';
      
      const packageData = {
        id: packageId,
        title: formData.name,
        price: formData.price ? formData.price.toString() : "0",
        duration: formData.duration || "미정",
        region: formData.region || "기타",
        region_ko: formData.regionKo || "기타",
        description: formData.description || `${formData.name} 패키지입니다.`,
        image: formData.image || defaultImage,
        images: validImages.length > 0 ? validImages : [defaultImage],
        highlights: validHighlights.length > 0 ? validHighlights : ["미정"], // JSONB 필드
        departure: formData.departure || "미정",
        type: formData.type || "기타",
        min_people: formData.min_people || 1,
        max_people: formData.max_people || 10,
        itinerary: formData.itinerary || "준비 중입니다.", // 현재는 문자열이지만 JSONB로 변환해야할 수도 있음
        included: validIncluded.length > 0 ? validIncluded : ["미정"], // JSONB 필드
        excluded: validExcluded.length > 0 ? validExcluded : ["미정"], // JSONB 필드
        notes: validNotes.length > 0 ? validNotes : ["미정"], // JSONB 필드
        is_featured: formData.is_featured || false,
        location: formData.location || "미정",
        rating: 4.0, // 기본 평점 추가
        features: [] // 빈 features 필드 추가
      }

      console.log('패키지 데이터 삽입 시도:', packageData);
      
      const { error, data } = await supabase
        .from('packages')
        .insert([packageData])
        .select()

      if (error) {
        console.error('Supabase 오류:', error);
        throw error
      }
      
      console.log('패키지 생성 성공:', data);

      alert('패키지가 성공적으로 생성되었습니다.')
      router.push('/admin/packages')
    } catch (error: any) {
      console.error('패키지 생성 실패:', error)
      setError(error.message || '패키지 생성에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/packages"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              패키지 목록으로 돌아가기
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">새 패키지 등록</h1>
        </div>

        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-600">패키지명만 입력하면 됩니다. 나머지 정보는 선택사항입니다.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 기본 정보 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  패키지명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">카테고리 선택</option>
                  <optgroup label="해외여행">
                    <option value="overseas-europe">유럽</option>
                    <option value="overseas-japan">일본</option>
                    <option value="overseas-southeast-asia">동남아</option>
                    <option value="overseas-americas">미주/캐나다/하와이</option>
                    <option value="overseas-taiwan-hongkong-macau">대만/홍콩/마카오</option>
                    <option value="overseas-guam-saipan">괌/사이판</option>
                  </optgroup>
                  <optgroup label="국내여행">
                    <option value="domestic-hotel">호텔/리조트</option>
                    <option value="domestic-pool-villa">풀빌라/펜션</option>
                  </optgroup>
                  <optgroup label="럭셔리">
                    <option value="luxury-europe">유럽</option>
                    <option value="luxury-japan">일본</option>
                    <option value="luxury-southeast-asia">동남아</option>
                    <option value="luxury-cruise">크루즈</option>
                    <option value="luxury-special-theme">이색테마</option>
                  </optgroup>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  가격
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="price"
                    value={formatNumber(formData.price)}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    원
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  위치
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 프랑스 파리, 베트남, 제주도"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  여행 기간
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 3박 4일"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  출발지
                </label>
                <input
                  type="text"
                  name="departure"
                  value={formData.departure}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="예: 인천국제공항"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최소 인원
                  </label>
                  <input
                    type="number"
                    name="min_people"
                    value={formData.min_people}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    최대 인원
                  </label>
                  <input
                    type="number"
                    name="max_people"
                    value={formData.max_people}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  패키지 설명
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="패키지의 간단한 설명을 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 상세 일정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">상세 일정</h2>
            <div>
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mb-3">
                <p>💡 <strong>이미지/웹 콘텐츠 붙여넣기 사용법:</strong></p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>스크린샷 도구나 그림판에서 <strong>이미지</strong>를 복사한 후 붙여넣기</li>
                  <li>웹 페이지에서 <strong>이미지가 포함된 영역</strong>을 드래그하여 복사한 후 붙여넣기</li>
                  <li>웹 사이트 콘텐츠를 드래그하여 <strong>전체 선택 후 복사</strong>하고 붙여넣기</li>
                </ul>
                <p className="mt-2 text-xs">* 웹 페이지 콘텐츠를 붙여넣을 때 이미지도 함께 가져옵니다.</p>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                여행 일정
              </label>
              <textarea
                value={formData.itinerary}
                onChange={(e) => handleItineraryChange(e.target.value)}
                onPaste={handleItineraryPaste}
                onKeyDown={(e) => {
                  // Ctrl+V 단축키 감지 및 핸들링
                  if (e.ctrlKey && e.key === 'v') {
                    console.log('Ctrl+V 단축키 감지됨');
                    // 붙여넣기는 브라우저가 처리하게 두고, onPaste 이벤트가 작동할 것임
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={8}
                placeholder="간략한 여행 일정을 입력하세요. 웹사이트 내용이나 이미지를 복사한 후 Ctrl+V로 붙여넣기 가능합니다!"
              />
            </div>
          </div>

          {/* 이미지 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">이미지 관리</h2>
            
            {/* 대표 이미지 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표 이미지
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="대표 이미지 URL 또는 파일 업로드"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(e, -1); // -1은 대표 이미지를 의미
                    }
                  }}
                  className="hidden"
                  id="main-image-upload"
                />
                <label
                  htmlFor="main-image-upload"
                  className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 cursor-pointer border border-blue-300"
                >
                  파일 선택
                </label>
              </div>
            </div>

            {/* 추가 이미지들 */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  추가 이미지 (최대 10장)
                </label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="hidden"
                    id="multiple-image-upload"
                  />
                  <label
                    htmlFor="multiple-image-upload"
                    className="flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 cursor-pointer border border-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                    여러 이미지 업로드
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    disabled={formData.images.length >= 10}
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    URL 추가
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 min-w-[20px]">{index + 1}.</span>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateArrayItem('images', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이미지 URL 또는 파일 업로드"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      id={`image-upload-${index}`}
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer border border-gray-300"
                    >
                      {uploadingImages.includes(index) ? '업로드 중...' : '파일 선택'}
                    </label>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {uploadingImages.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-blue-700">
                        {uploadingImages.length}개 이미지 업로드 중...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 포함/불포함 사항 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">포함/불포함 사항</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 포함 사항 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    포함 사항
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('included')}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <Plus className="w-4 h-4" />
                    항목 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.included.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('included', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="포함 사항을 입력하세요"
                      />
                      {formData.included.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('included', index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 불포함 사항 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    불포함 사항
                  </label>
                  <button
                    type="button"
                    onClick={() => addArrayItem('excluded')}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                  >
                    <Plus className="w-4 h-4" />
                    항목 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.excluded.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateArrayItem('excluded', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="불포함 사항을 입력하세요"
                      />
                      {formData.excluded.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('excluded', index)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 주요 특징 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">주요 특징</h2>
              <button
                type="button"
                onClick={() => addArrayItem('highlights')}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                특징 추가
              </button>
            </div>
            <div className="space-y-3">
              {formData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) => updateArrayItem('highlights', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="패키지의 주요 특징을 입력하세요"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('highlights', index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">주의사항</h2>
              <button
                type="button"
                onClick={() => addArrayItem('notes')}
                className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
              >
                <Plus className="w-4 h-4" />
                주의사항 추가
              </button>
            </div>
            <div className="space-y-3">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => updateArrayItem('notes', index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="여행 시 주의사항을 입력하세요"
                  />
                  {formData.notes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('notes', index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 기타 설정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">기타 설정</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  추천 패키지로 설정
                </label>
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/packages"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '저장 중...' : '패키지 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
