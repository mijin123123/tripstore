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
    category: '',
    location: ''
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
      const newImages = [...formData.images]
      newImages[index] = imageUrl
      setFormData({ ...formData, images: newImages })
    } catch (error) {
      alert('이미지 업로드에 실패했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const supabase = createClient()
      
      // 빈 이미지 URL 제거
      const validImages = formData.images.filter(img => img.trim() !== '')
      
      // 빈 항목들 제거
      const validHighlights = formData.highlights.filter(item => item.trim() !== '')
      const validIncluded = formData.included.filter(item => item.trim() !== '')
      const validExcluded = formData.excluded.filter(item => item.trim() !== '')
      const validNotes = formData.notes.filter(item => item.trim() !== '')

      const packageData = {
        name: formData.name,
        price: formData.price,
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
        category: formData.category,
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

          {/* 기타 설정 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">기타 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  대표 이미지 URL
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="대표 이미지 URL을 입력하세요"
                />
              </div>
              
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
