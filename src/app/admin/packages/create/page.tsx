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
    itinerary: [{
      day: 1,
      title: '',
      description: '',
      accommodation: '',
      meals: { breakfast: false, lunch: false, dinner: false }
    }],
    included: [''],
    excluded: [''],
    notes: [''],
    is_featured: false,
    start_date: '',
    end_date: '',
    location: '',
    category: ''
  })
  
  // 숫자를 천 단위 콤마 형식으로 변환하는 함수
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR')
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      } else if (value === 'overseas-china-hongkong') {
        newType = 'overseas';
        newRegion = 'china-hongkong';
        newRegionKo = '대만/홍콩/마카오';
      } else if (value === 'overseas-guam-saipan') {
        newType = 'overseas';
        newRegion = 'guam-saipan';
        newRegionKo = '괌/사이판';
      } else if (value === 'domestic-hotel') {
        newType = 'domestic';
        newRegion = 'hotel';
        newRegionKo = '호텔';
      } else if (value === 'domestic-resort') {
        newType = 'domestic';
        newRegion = 'resort';
        newRegionKo = '리조트';
      } else if (value === 'domestic-pool-villa') {
        newType = 'domestic';
        newRegion = 'pool-villa';
        newRegionKo = '풀빌라';
      } else if (value === 'hotel-europe') {
        newType = 'hotel';
        newRegion = 'europe';
        newRegionKo = '유럽';
      } else if (value === 'hotel-japan') {
        newType = 'hotel';
        newRegion = 'japan';
        newRegionKo = '일본';
      } else if (value === 'hotel-southeast-asia') {
        newType = 'hotel';
        newRegion = 'southeast-asia';
        newRegionKo = '동남아';
      } else if (value === 'hotel-americas') {
        newType = 'hotel';
        newRegion = 'americas';
        newRegionKo = '미주/캐나다/하와이';
      } else if (value === 'hotel-china-hongkong') {
        newType = 'hotel';
        newRegion = 'china-hongkong';
        newRegionKo = '대만/홍콩/마카오';
      } else if (value === 'hotel-guam-saipan') {
        newType = 'hotel';
        newRegion = 'guam-saipan';
        newRegionKo = '괌/사이판';
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
  
  const handleArrayChange = (index: number, value: string, field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }
  
  const addArrayItem = (field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    if (field === 'images' && formData.images.length >= 10) {
      alert('이미지는 최대 10개까지만 추가할 수 있습니다.');
      return;
    }
    const newArray = [...formData[field], '']
    setFormData({ ...formData, [field]: newArray })
  }
  
  const removeArrayItem = (index: number, field: 'highlights' | 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }
  
  const handleItineraryChange = (index: number, field: string, value: any) => {
    const newItinerary = [...formData.itinerary]
    
    if (field === 'breakfast' || field === 'lunch' || field === 'dinner') {
      newItinerary[index].meals = {
        ...newItinerary[index].meals,
        [field]: value
      }
    } else {
      // @ts-ignore
      newItinerary[index][field] = value
    }
    
    setFormData({ ...formData, itinerary: newItinerary })
  }
  
  const addItineraryDay = () => {
    const lastDay = formData.itinerary[formData.itinerary.length - 1].day
    const newDay = {
      day: lastDay + 1,
      title: '',
      description: '',
      accommodation: '',
      meals: { breakfast: false, lunch: false, dinner: false }
    }
    
    setFormData({ ...formData, itinerary: [...formData.itinerary, newDay] })
  }
  
  const removeItineraryDay = (index: number) => {
    const newItinerary = formData.itinerary
      .filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: i + 1 }))
      
    setFormData({ ...formData, itinerary: newItinerary })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      // 필수 필드 검증
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('필수 필드를 모두 입력해주세요. (이름, 가격, 카테고리)')
      }
      
      // 배열 필드에서 빈 항목 필터링
      const highlights = formData.highlights.filter(item => item.trim() !== '')
      const included = formData.included.filter(item => item.trim() !== '')
      const excluded = formData.excluded.filter(item => item.trim() !== '')
      const notes = formData.notes.filter(item => item.trim() !== '')
      const images = formData.images.filter(item => item.trim() !== '')
      
      // 여행 일정 검증
      const itinerary = formData.itinerary.map(day => ({
        ...day,
        title: day.title.trim() || `Day ${day.day}`,
        description: day.description.trim()
      }))
      
      // 고유 ID 생성
      const packageId = `pkg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 데이터베이스 삽입 준비
      const supabase = createClient()
      
      // 패키지 생성
      const { error } = await supabase
        .from('packages')
        .insert({
          // id 필드는 데이터베이스에서 자동으로 생성되도록 제외
          name: formData.name, // 필드명을 name으로 수정
          price: formData.price || 0, // String 타입 변환 제거
          region: formData.region,
          region_ko: formData.regionKo || '',
          type: formData.type, // type 필드를 올바르게 저장 (overseas, hotel, domestic, luxury)
          description: formData.description || '',
          image: images.length > 0 ? images[0] : '', // 첫 번째 이미지를 메인 이미지로 사용
          images: images.length > 0 ? images : [''], // 이미지 배열 저장
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          highlights: highlights.length ? highlights : [''],
          itinerary: itinerary || [{day: 1, title: '', description: '', accommodation: '', meals: {breakfast: false, lunch: false, dinner: false}}],
          included: included.length ? included : [''],
          excluded: excluded.length ? excluded : [''],
          notes: notes.length ? notes : [''],
          min_people: formData.min_people || 1,
          max_people: formData.max_people || 10,
          location: formData.location || ''
        })
      
      if (error) throw error
      
      // 성공 후 목록 페이지로 이동
      router.push('/admin/packages')
      router.refresh()
      
    } catch (error: any) {
      console.error('패키지 생성 실패:', error)
      setError(error.message || '패키지 생성 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <div className="pb-12">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin/packages" className="mr-4 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">새 패키지 추가</h1>
        </div>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">카테고리 선택</option>
                <optgroup label="해외여행">
                  <option value="overseas-europe">유럽</option>
                  <option value="overseas-japan">일본</option>
                  <option value="overseas-southeast-asia">동남아</option>
                  <option value="overseas-americas">미주/캐나다/하와이</option>
                  <option value="overseas-china-hongkong">대만/홍콩/마카오</option>
                  <option value="overseas-guam-saipan">괌/사이판</option>
                </optgroup>
                <optgroup label="국내여행">
                  <option value="domestic-hotel">호텔</option>
                  <option value="domestic-resort">리조트</option>
                  <option value="domestic-pool-villa">풀빌라</option>
                </optgroup>
                <optgroup label="호텔">
                  <option value="hotel-europe">유럽</option>
                  <option value="hotel-japan">일본</option>
                  <option value="hotel-southeast-asia">동남아</option>
                  <option value="hotel-americas">미주/캐나다/하와이</option>
                  <option value="hotel-china-hongkong">대만/홍콩/마카오</option>
                  <option value="hotel-guam-saipan">괌/사이판</option>
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
                  onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 프랑스 파리, 방콕, 제주도"
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 인천공항"
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작 날짜
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료 날짜
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="패키지에 대한 상세 설명을 입력하세요"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  패키지 이미지 URL
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  disabled={formData.images.length >= 10}
                  className={`flex items-center text-sm ${
                    formData.images.length >= 10 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  <Plus size={16} className="mr-1" /> 이미지 추가
                </button>
              </div>
              
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="mb-4">
                  <div className="flex mb-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'images')}
                      className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md text-red-600 hover:text-red-800 hover:bg-red-50"
                      disabled={formData.images.length <= 1}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {imageUrl && (
                    <div className="relative h-32 w-full md:w-1/2 border rounded-md overflow-hidden bg-gray-50">
                      <img
                        src={imageUrl}
                        alt={`패키지 이미지 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://via.placeholder.com/300x200?text=이미지+오류"
                        }}
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          메인 이미지
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              <p className="text-xs text-gray-500 mt-2">
                첫 번째 이미지가 메인 이미지로 사용됩니다. 이미지는 최대 10개까지 추가 가능합니다.
              </p>
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                추천 패키지 (메인 페이지에 표시)
              </label>
            </div>
          </div>
        </div>
        
        {/* 하이라이트 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">여행 하이라이트</h2>
            <button
              type="button"
              onClick={() => addArrayItem('highlights')}
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> 추가
            </button>
          </div>
          
          {formData.highlights.map((highlight, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleArrayChange(index, e.target.value, 'highlights')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="여행의 특별한 점을 기재하세요"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'highlights')}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.highlights.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Link
            href="/admin/packages"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            취소
          </Link>
          
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                저장 중...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" /> 저장하기
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
/ /   ��  9�X�  \���  8��  tհ�  �� �  T�ܴ 
 