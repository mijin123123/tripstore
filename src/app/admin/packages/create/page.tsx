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

  // 이미지 붙여넣기 핸들러
  const handleItineraryPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        
        try {
          const file = item.getAsFile();
          if (file) {
            const base64 = await convertToBase64(file);
            const imageMarkdown = `![이미지](${base64})`;
            
            const textarea = e.currentTarget;
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            const beforeText = formData.itinerary.substring(0, startPos);
            const afterText = formData.itinerary.substring(endPos);
            
            const newItinerary = beforeText + imageMarkdown + afterText;
            handleItineraryChange(newItinerary);
            
            // 커서 위치 조정
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = startPos + imageMarkdown.length;
              textarea.focus();
            }, 0);
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
      // 필수 필드 검증
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('필수 필드를 모두 입력해주세요. (이름, 가격, 카테고리)')
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

      const packageData = {
        id: packageId,
        title: formData.name,
        price: formData.price.toString(),
        duration: formData.duration,
        region: formData.region,
        region_ko: formData.regionKo,
        description: formData.description,
        image: formData.image,
        images: validImages,
        highlights: validHighlights,
        departure: formData.departure,
        type: formData.type,
        min_people: formData.min_people,
        max_people: formData.max_people,
        itinerary: formData.itinerary,
        included: validIncluded,
        excluded: validExcluded,
        notes: validNotes,
        is_featured: formData.is_featured,
        location: formData.location
      }

      const { error } = await supabase
        .from('packages')
        .insert([packageData])

      if (error) {
        throw error
      }

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
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  가격 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="price"
                    value={formatNumber(formData.price)}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                여행 일정
              </label>
              <textarea
                value={formData.itinerary}
                onChange={(e) => handleItineraryChange(e.target.value)}
                onPaste={handleItineraryPaste}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                placeholder="간략한 여행 일정을 입력하세요. 이미지도 붙여넣기 가능합니다!"
              />
            </div>
          </div>

          {/* 이미지 관리 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">이미지 관리</h2>
            
            {/* 대표 이미지 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표 이미지 <span className="text-red-500">*</span>
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
