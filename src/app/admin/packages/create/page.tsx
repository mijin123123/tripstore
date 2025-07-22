'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

type Category = {
  id: number
  name: string
  slug: string
  parent_id: number | null
}

export default function CreatePackage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  
  // 카테고리 ID와 지역명 매핑 정의
  const categoryRegionMap: Record<number, { region: string, regionKo: string }> = {
    // 메인 카테고리
    1: { region: 'overseas', regionKo: '해외여행' },
    2: { region: 'domestic', regionKo: '국내여행' },
    3: { region: 'hotel', regionKo: '호텔' },
    
    // 해외여행 서브 카테고리
    4: { region: 'europe', regionKo: '유럽' },
    5: { region: 'southeast-asia', regionKo: '동남아시아' },
    6: { region: 'japan', regionKo: '일본' },
    7: { region: 'americas', regionKo: '미주' },
    8: { region: 'china-hongkong', regionKo: '중국/홍콩' },
    9: { region: 'guam-saipan', regionKo: '괌/사이판' },
    
    // 국내여행 서브 카테고리
    10: { region: 'seoul', regionKo: '서울' },
    11: { region: 'jeju', regionKo: '제주' },
    12: { region: 'busan', regionKo: '부산' },
    13: { region: 'gangwon', regionKo: '강원' },
    14: { region: 'gyeonggi', regionKo: '경기' },
    15: { region: 'incheon', regionKo: '인천' },
    16: { region: 'gyeongsang', regionKo: '경상' },
    17: { region: 'jeolla', regionKo: '전라' },
    18: { region: 'chungcheong', regionKo: '충청' },
    // 필요에 따라 더 많은 카테고리 매핑을 추가할 수 있습니다
  }
  
  // 타입과 지역명 매핑 정의
  const typeRegionMap: Record<string, { region: string, regionKo: string }> = {
    'overseas': { region: 'overseas', regionKo: '해외' },
    'hotel': { region: 'hotel', regionKo: '호텔' },
    'domestic': { region: 'domestic', regionKo: '국내' },
    'luxury': { region: 'luxury', regionKo: '럭셔리' },
  }

  const [formData, setFormData] = useState({
    id: '', // 자동 생성될 ID
    title: '',
    price: '',
    duration: '',
    region: '',
    region_ko: '',
    region_id: 0,
    category_id: 0,
    type: '',
    rating: 4.5,
    departure: '',
    description: '',
    images: [''], // 여러 이미지 URL을 저장하는 배열
    highlights: [''],
    features: [''],
    included: [''],
    excluded: [''],
    notes: [''],
    itinerary: [{ 
      day: 1, 
      title: '', 
      description: '', 
      accommodation: '', 
      meals: { breakfast: false, lunch: false, dinner: false } 
    }],
    max_people: 10,
    min_people: 1,
    is_featured: false
  })
  
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        // 카테고리 가져오기
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .order('id')
        
        if (categoryError) throw categoryError
        
        setCategories(categoryData || [])
        
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error)
        setError('카테고리 데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])
  
  // 패키지 ID 자동 생성
  useEffect(() => {
    if (formData.type && formData.region) {
      const generateId = () => {
        const prefix = formData.type.substring(0, 3).toUpperCase()
        const regionCode = formData.region.substring(0, 2).toUpperCase()
        const timestamp = Date.now().toString().substring(7)
        return `${prefix}-${regionCode}-${timestamp}`
      }
      
      setFormData(prev => ({ ...prev, id: generateId() }))
    }
  }, [formData.type, formData.region])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // 카테고리 선택 시 자동으로 지역명 설정
    if (name === 'category_id' && value) {
      const categoryId = parseInt(value, 10)
      
      // 선택한 카테고리 찾기
      const selectedCategory = categories.find(cat => cat.id === categoryId)
      let regionInfo = categoryRegionMap[categoryId]
      
      // 디버깅을 위한 로그
      console.log('카테고리 선택:', {
        categoryId,
        selectedCategory,
        regionInfo,
        allCategories: categories
      })
      
      // 현재 카테고리에 매핑이 없고, 부모 카테고리가 있는 경우
      if (!regionInfo && selectedCategory && selectedCategory.parent_id) {
        // 부모 카테고리의 매핑 사용
        regionInfo = categoryRegionMap[selectedCategory.parent_id]
        console.log('부모 카테고리 매핑 사용:', {
          parentId: selectedCategory.parent_id,
          parentRegionInfo: regionInfo
        })
      }
      
      if (regionInfo) {
        setFormData(prev => ({
          ...prev,
          region: regionInfo.region,
          region_ko: regionInfo.regionKo, // 데이터베이스는 region_ko지만 매핑은 regionKo 사용
        }))
      }
      
      // 타입도 설정 (해외여행, 국내여행, 호텔 등)
      if (selectedCategory) {
        // 부모 카테고리가 있으면 부모의 타입을 사용
        const parentCategory = selectedCategory.parent_id 
          ? categories.find(cat => cat.id === selectedCategory.parent_id) 
          : null
        
        if (parentCategory && parentCategory.slug) {
          const typeFromSlug = parentCategory.slug // 'overseas', 'domestic', 'hotel' 등
          setFormData(prev => ({
            ...prev,
            type: typeFromSlug
          }))
        } else if (selectedCategory.slug) {
          // 메인 카테고리인 경우
          setFormData(prev => ({
            ...prev,
            type: selectedCategory.slug
          }))
        }
      }
    }
    
    // 타입 선택 시 자동으로 기본 지역명 설정 (카테고리에 의해 덮어쓰여질 수 있음)
    if (name === 'type' && value && !formData.region) {
      const typeInfo = typeRegionMap[value]
      
      if (typeInfo) {
        setFormData(prev => ({
          ...prev,
          region: typeInfo.region,
          region_ko: typeInfo.regionKo, // 데이터베이스는 region_ko지만 매핑은 regionKo 사용
        }))
      }
    }
    
    // 지역 직접 입력 시 ID는 0으로 설정
    if (name === 'region' || name === 'region_ko') {
      setFormData(prev => ({
        ...prev,
        region_id: 0 // 직접 입력 시 ID는 0으로 설정
      }))
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  // 하이라이트 관리
  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights]
    newHighlights[index] = value
    setFormData(prev => ({ ...prev, highlights: newHighlights }))
  }
  
  const addHighlight = () => {
    setFormData(prev => ({ ...prev, highlights: [...prev.highlights, ''] }))
  }
  
  const removeHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, highlights: newHighlights.length ? newHighlights : [''] }))
  }
  
  // 기능 관리
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({ ...prev, features: newFeatures }))
  }
  
  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }
  
  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, features: newFeatures.length ? newFeatures : [''] }))
  }
  
  // 포함 항목 관리
  const handleIncludedChange = (index: number, value: string) => {
    const newIncluded = [...formData.included]
    newIncluded[index] = value
    setFormData(prev => ({ ...prev, included: newIncluded }))
  }
  
  const addIncluded = () => {
    setFormData(prev => ({ ...prev, included: [...prev.included, ''] }))
  }
  
  const removeIncluded = (index: number) => {
    const newIncluded = formData.included.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, included: newIncluded.length ? newIncluded : [''] }))
  }
  
  // 불포함 항목 관리
  const handleExcludedChange = (index: number, value: string) => {
    const newExcluded = [...formData.excluded]
    newExcluded[index] = value
    setFormData(prev => ({ ...prev, excluded: newExcluded }))
  }
  
  const addExcluded = () => {
    setFormData(prev => ({ ...prev, excluded: [...prev.excluded, ''] }))
  }
  
  const removeExcluded = (index: number) => {
    const newExcluded = formData.excluded.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, excluded: newExcluded.length ? newExcluded : [''] }))
  }
  
  // 참고사항 관리
  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...formData.notes]
    newNotes[index] = value
    setFormData(prev => ({ ...prev, notes: newNotes }))
  }
  
  const addNote = () => {
    setFormData(prev => ({ ...prev, notes: [...prev.notes, ''] }))
  }
  
  const removeNote = (index: number) => {
    const newNotes = formData.notes.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, notes: newNotes.length ? newNotes : [''] }))
  }
  
  // 일정 관리
  const handleItineraryChange = (index: number, field: string, value: any) => {
    const newItinerary = [...formData.itinerary]
    
    if (field.startsWith('meals.')) {
      const mealType = field.split('.')[1]
      newItinerary[index] = {
        ...newItinerary[index],
        meals: {
          ...newItinerary[index].meals,
          [mealType]: value
        }
      }
    } else {
      newItinerary[index] = { ...newItinerary[index], [field]: value }
    }
    
    setFormData(prev => ({ ...prev, itinerary: newItinerary }))
  }
  
  const addItineraryDay = () => {
    const newDay = formData.itinerary.length + 1
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, {
        day: newDay,
        title: '',
        description: '',
        accommodation: '',
        meals: { breakfast: false, lunch: false, dinner: false }
      }]
    }))
  }
  
  const removeItineraryDay = (index: number) => {
    const newItinerary = formData.itinerary.filter((_, i) => i !== index)
    // 일자 재정렬
    const reorderedItinerary = newItinerary.map((day, idx) => ({
      ...day,
      day: idx + 1
    }))
    setFormData(prev => ({ ...prev, itinerary: reorderedItinerary.length ? reorderedItinerary : [{
      day: 1,
      title: '',
      description: '',
      accommodation: '',
      meals: { breakfast: false, lunch: false, dinner: false }
    }] }))
  }
  
  // 이미지 URL 입력 처리
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  }
  
  // 이미지 URL 추가
  const addImage = () => {
    if (formData.images.length < 10) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    } else {
      setError('이미지는 최대 10개까지만 추가할 수 있습니다.');
    }
  }
  
  // 이미지 URL 제거
  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({ 
      ...prev, 
      images: newImages.length ? newImages : [''] 
    }));
  }
  
  // 패키지 저장 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    // 이미지 URL 검증
    const filteredImages = formData.images.filter(url => url.trim() !== '')
    if (filteredImages.length === 0) {
      setError('최소 한 개 이상의 이미지 URL을 입력해주세요.')
      setIsSaving(false)
      return
    }
    
    // 필수 입력값 검증
    if (!formData.title || !formData.price || !formData.description || 
        !formData.duration || !formData.type || !formData.departure || !formData.category_id) {
      setError('필수 입력 필드를 모두 채워주세요.')
      setIsSaving(false)
      return
    }
    
    // 카테고리 선택 후에도 지역명이 없는 경우 - 타입 정보로 기본값 설정
    if (!formData.region || !formData.region_ko) {
      if (formData.type && typeRegionMap[formData.type]) {
        const typeInfo = typeRegionMap[formData.type];
        formData.region = typeInfo.region;
        formData.region_ko = typeInfo.regionKo;
      } else {
        setError('지역 정보가 설정되지 않았습니다. 다른 카테고리를 선택해 보세요.')
        setIsSaving(false)
        return
      }
    }
    
    // 빈 배열 항목 필터링
    const filteredHighlights = formData.highlights.filter(item => item.trim() !== '')
    const filteredFeatures = formData.features.filter(item => item.trim() !== '')
    const filteredIncluded = formData.included.filter(item => item.trim() !== '')
    const filteredExcluded = formData.excluded.filter(item => item.trim() !== '')
    const filteredNotes = formData.notes.filter(item => item.trim() !== '')
    
    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('packages')
        .insert({
          id: formData.id,
          title: formData.title,
          price: formData.price,
          duration: formData.duration,
          region: formData.region,
          region_ko: formData.region_ko,
          region_id: 0, // 지역 ID는 0으로 설정 (직접 입력 사용)
          type: formData.type,
          rating: formData.rating,
          departure: formData.departure,
          description: formData.description,
          image: filteredImages[0], // 첫 번째 이미지를 대표 이미지로 사용
          images: filteredImages, // 모든 이미지 URL 배열 저장
          highlights: filteredHighlights,
          features: filteredFeatures,
          included: filteredIncluded,
          excluded: filteredExcluded,
          notes: filteredNotes,
          itinerary: formData.itinerary,
          category_id: formData.category_id,
          max_people: formData.max_people,
          min_people: formData.min_people,
          is_featured: formData.is_featured
        })
      
      if (error) throw error
      
      router.push('/admin/packages')
    } catch (error: any) {
      console.error('패키지 저장 실패:', error)
      setError(`패키지 저장에 실패했습니다: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/admin/packages" className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold">새 패키지 추가</h1>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <Save className="h-5 w-5 mr-2" />
          <span>{isSaving ? '저장 중...' : '패키지 저장'}</span>
        </button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 기본 정보 섹션 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">패키지 ID</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                readOnly
                placeholder="자동 생성됩니다"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">패키지 제목 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="패키지 제목을 입력하세요"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 <span className="text-red-500">*</span></label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} {category.parent_id ? '(서브 카테고리)' : '(메인 카테고리)'}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500">
                카테고리 선택 시 지역명이 자동으로 설정됩니다.
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">타입 <span className="text-red-500">*</span></label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">타입 선택</option>
                <option value="overseas">해외여행</option>
                <option value="hotel">호텔</option>
                <option value="domestic">국내여행</option>
                <option value="luxury">럭셔리</option>
              </select>
            </div>
            
            <div className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-1">지역명(영문)</label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="자동 설정됩니다"
              />
            </div>
            
            <div className="hidden">
              <label className="block text-sm font-medium text-gray-700 mb-1">지역명(한글)</label>
              <input
                type="text"
                name="region_ko"
                value={formData.region_ko}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 유럽, 일본, 동남아시아"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 1,290,000원~"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기간 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 3박 4일"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">출발 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 인천출발"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">평점</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">최소 인원</label>
              <input
                type="number"
                name="min_people"
                value={formData.min_people}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">최대 인원</label>
              <input
                type="number"
                name="max_people"
                value={formData.max_people}
                onChange={handleInputChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">설명 <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="패키지에 대한 설명을 입력하세요"
                required
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">추천 패키지로 설정</label>
            </div>
          </div>
        </div>
        
        {/* 이미지 URL 입력 섹션 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">이미지 URL <span className="text-red-500">*</span> (최대 10개)</h2>
          
          <div className="space-y-4">
            {formData.images.map((imageUrl, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`이미지 URL ${index + 1} (https://로 시작하는 이미지 주소)`}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {imageUrl && (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={`패키지 이미지 ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=이미지+로드+실패';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
            
            {formData.images.length < 10 && (
              <button
                type="button"
                onClick={addImage}
                className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> 이미지 URL 추가 ({formData.images.length}/10)
              </button>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              * 첫번째 이미지가 대표 이미지로 사용됩니다
            </p>
          </div>
        </div>
        
        {/* 하이라이트 섹션 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">하이라이트 <span className="text-red-500">*</span></h2>
          <div className="space-y-3">
            {formData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => handleHighlightChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`하이라이트 ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addHighlight}
              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" /> 하이라이트 추가
            </button>
          </div>
        </div>
        
        {/* 기능 섹션 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">주요 특징</h2>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`특징 ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" /> 특징 추가
            </button>
          </div>
        </div>
        
        {/* 포함/불포함/참고사항 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 포함 사항 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">포함 사항</h2>
            <div className="space-y-3">
              {formData.included.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleIncludedChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`포함 항목 ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeIncluded(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addIncluded}
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> 항목 추가
              </button>
            </div>
          </div>
          
          {/* 불포함 사항 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">불포함 사항</h2>
            <div className="space-y-3">
              {formData.excluded.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleExcludedChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`불포함 항목 ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeExcluded(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addExcluded}
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> 항목 추가
              </button>
            </div>
          </div>
          
          {/* 참고 사항 */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">참고 사항</h2>
            <div className="space-y-3">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => handleNoteChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`참고 사항 ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeNote(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addNote}
                className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" /> 항목 추가
              </button>
            </div>
          </div>
        </div>
        
        {/* 일정 섹션 */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">일정</h2>
          <div className="space-y-6">
            {formData.itinerary.map((day, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Day {day.day}</h3>
                  {formData.itinerary.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItineraryDay(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="일정 제목"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <textarea
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="일정 설명"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">숙박</label>
                    <input
                      type="text"
                      value={day.accommodation}
                      onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="숙박 정보"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">식사</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={day.meals.breakfast}
                          onChange={(e) => handleItineraryChange(index, 'meals.breakfast', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span>아침</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={day.meals.lunch}
                          onChange={(e) => handleItineraryChange(index, 'meals.lunch', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span>점심</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={day.meals.dinner}
                          onChange={(e) => handleItineraryChange(index, 'meals.dinner', e.target.checked)}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span>저녁</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addItineraryDay}
              className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" /> 일정 추가 (Day {formData.itinerary.length + 1})
            </button>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link href="/admin/packages" className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            취소
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center transition-colors ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <Save className="h-5 w-5 mr-2" />
            <span>{isSaving ? '저장 중...' : '패키지 저장'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
