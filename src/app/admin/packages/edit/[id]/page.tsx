'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

type Category = {
  id: number
  name: string
  slug: string
  parent_id: number | null
}

// 패키지 타입 정의
type Package = {
  id: string
  name: string
  price: string | number // price는 데이터베이스에서 TEXT 타입이므로 string도 허용
  region: string | null
  category: string | null
  location: string
  image: string | null
  description: string | null
  is_featured: boolean
  start_date: string | null
  end_date: string | null
  type?: string
  highlights?: string[]
  departure?: string
  min_people?: number
  max_people?: number
  itinerary?: {
    day: number
    title: string
    description: string
    accommodation: string
    meals: {
      breakfast: boolean
      lunch: boolean
      dinner: boolean
    }
  }[]
  included?: string[]
  excluded?: string[]
  notes?: string[]
  duration?: string
  created_at?: string
}

export default function EditPackage() {
  const router = useRouter()
  const params = useParams()
  const packageId = params?.id as string
  
  const [categories, setCategories] = useState<Category[]>([])
  const [mainCategories, setMainCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<Category[]>([])
  const [filteredSubCategories, setFilteredSubCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [packageLoaded, setPackageLoaded] = useState(false)
  
  // 카테고리 ID와 지역명 매핑 정의
  const categoryRegionMap: Record<number, { region: string, regionKo: string }> = {
    // 메인 카테고리
    1: { region: 'overseas', regionKo: '해외여행' },
    2: { region: 'hotel', regionKo: '호텔' },
    3: { region: 'domestic', regionKo: '국내' },
    4: { region: 'luxury', regionKo: '럭셔리' },
    
    // 해외여행(overseas) 서브 카테고리
    11: { region: 'europe', regionKo: '유럽' },
    12: { region: 'southeast-asia', regionKo: '동남아' },
    13: { region: 'japan', regionKo: '일본' },
    14: { region: 'guam-saipan', regionKo: '괌/사이판' },
    15: { region: 'americas', regionKo: '미주/캐나다/하와이' },
    16: { region: 'china-hongkong', regionKo: '대만/홍콩/마카오' },
    
    // 호텔(hotel) 서브 카테고리
    21: { region: 'europe', regionKo: '유럽' },
    22: { region: 'southeast-asia', regionKo: '동남아' },
    23: { region: 'japan', regionKo: '일본' },
    24: { region: 'guam-saipan', regionKo: '괌/사이판' },
    25: { region: 'americas', regionKo: '미주/캐나다/하와이' },
    26: { region: 'china-hongkong', regionKo: '대만/홍콩/마카오' },
    
    // 국내(domestic) 서브 카테고리
    31: { region: 'hotel', regionKo: '호텔' },
    32: { region: 'resort', regionKo: '리조트' },
    33: { region: 'pool-villa', regionKo: '풀빌라' },
    
    // 럭셔리(luxury) 서브 카테고리
    41: { region: 'europe', regionKo: '유럽' },
    42: { region: 'japan', regionKo: '일본' },
    43: { region: 'southeast-asia', regionKo: '동남아' },
    44: { region: 'cruise', regionKo: '크루즈' },
    45: { region: 'special-theme', regionKo: '이색테마' },
  }
  
  // 타입과 지역명 매핑 정의
  const typeRegionMap: Record<string, { region: string, regionKo: string }> = {
    'overseas': { region: 'overseas', regionKo: '해외여행' },
    'hotel': { region: 'hotel', regionKo: '호텔' },
    'domestic': { region: 'domestic', regionKo: '국내' },
    'luxury': { region: 'luxury', regionKo: '럭셔리' },
  }

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    duration: '',
    region: '',
    regionKo: '',
    region_id: 0,
    category_id: 0,
    subcategory_id: 0,
    description: '',
    image: '',
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
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const supabase = createClient()
        const { data: categoriesData, error } = await supabase
          .from('categories')
          .select('*')
          .order('id', { ascending: true })
        
        if (error) throw error
        
        const mainCats = categoriesData.filter(cat => cat.parent_id === null)
        const subCats = categoriesData.filter(cat => cat.parent_id !== null)
        
        setCategories(categoriesData)
        setMainCategories(mainCats)
        setSubCategories(subCats)
        
      } catch (error) {
        console.error('카테고리를 불러오는데 실패했습니다:', error)
      }
    }
    
    const fetchPackage = async () => {
      try {
        const supabase = createClient()
        const { data: packageData, error } = await supabase
          .from('packages')
          .select('*')
          .eq('id', packageId)
          .single()
        
        if (error) throw error
        
        if (packageData) {
          // 타입 문제 해결을 위해 any로 처리
          const pkg = packageData as any;
          
          // 패키지 데이터 확인을 위한 로깅
          console.log('불러온 패키지 데이터:', pkg);
          
          // 폼 데이터 설정 (데이터베이스에 없는 필드는 기본값 설정)
          setFormData({
            id: pkg.id || '',
            name: pkg.name || '',
            price: pkg.price || 0,
            region: pkg.region || '',
            regionKo: '', // 나중에 매핑
            region_id: 0, // 나중에 설정
            category_id: 0, // 나중에 설정
            subcategory_id: 0, // 나중에 설정
            description: pkg.description || '',
            image: pkg.image || '',
            highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [''],
            departure: pkg.departure || '',
            type: pkg.type || pkg.category || '',
            min_people: pkg.min_people || 1,
            max_people: pkg.max_people || 10,
            itinerary: Array.isArray(pkg.itinerary) ? pkg.itinerary : [{
              day: 1,
              title: '',
              description: '',
              accommodation: '',
              meals: { breakfast: false, lunch: false, dinner: false }
            }],
            included: Array.isArray(pkg.included) ? pkg.included : [''],
            excluded: Array.isArray(pkg.excluded) ? pkg.excluded : [''],
            notes: Array.isArray(pkg.notes) ? pkg.notes : [''],
            is_featured: pkg.is_featured || false,
            start_date: pkg.start_date || '',
            end_date: pkg.end_date || '',
            duration: pkg.duration || '',
            location: pkg.location || '',
            category: pkg.category || ''
          })
          
          // 지역 및 카테고리 설정
          if (packageData.category) {
            // 카테고리로 메인 카테고리 찾기
            const mainType = packageData.category;
            
            // 메인 카테고리에 대한 ID 설정
            let mainCategoryId = 0;
            if (mainType === 'overseas') mainCategoryId = 1;
            else if (mainType === 'hotel') mainCategoryId = 2;
            else if (mainType === 'domestic') mainCategoryId = 3;
            else if (mainType === 'luxury') mainCategoryId = 4;
            
            if (mainCategoryId > 0) {
              setFormData(prev => ({
                ...prev,
                category_id: mainCategoryId
              }))
              
              // 서브 카테고리 필터링
              const subs = subCategories.filter(cat => cat.parent_id === mainCategoryId)
              setFilteredSubCategories(subs)
              
              // 지역으로 서브 카테고리 찾기
              if (packageData.region) {
                const subCat = Object.entries(categoryRegionMap).find(([id, info]) => {
                  return info.region === packageData.region && Number(id) > 10 && Math.floor(Number(id) / 10) === mainCategoryId
                })
                
                if (subCat) {
                  setFormData(prev => ({
                    ...prev,
                    subcategory_id: Number(subCat[0])
                  }))
                }
              }
            }
          }
          
          setPackageLoaded(true)
        }
      } catch (error) {
        console.error('패키지를 불러오는데 실패했습니다:', error)
        setError('패키지를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
    fetchPackage()
  }, [packageId])
  
  // 메인 카테고리 변경 시 서브 카테고리 필터링
  useEffect(() => {
    if (formData.category_id) {
      const filtered = subCategories.filter(cat => cat.parent_id === formData.category_id)
      setFilteredSubCategories(filtered)
      
      // 지역 정보 업데이트
      const regionInfo = categoryRegionMap[formData.category_id]
      if (regionInfo) {
        setFormData(prev => ({
          ...prev,
          type: regionInfo.region,
          region: regionInfo.region,
          regionKo: regionInfo.regionKo
        }))
      }
    }
  }, [formData.category_id, subCategories])
  
  // 서브 카테고리 변경 시 지역 정보 업데이트
  useEffect(() => {
    if (formData.subcategory_id) {
      const regionInfo = categoryRegionMap[formData.subcategory_id]
      if (regionInfo) {
        setFormData(prev => ({
          ...prev,
          region: regionInfo.region,
          regionKo: regionInfo.regionKo
        }))
      }
    }
  }, [formData.subcategory_id])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name === 'price') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else if (name === 'category_id' || name === 'subcategory_id' || name === 'min_people' || name === 'max_people') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }
  
  const handleArrayChange = (index: number, value: string, field: 'highlights' | 'included' | 'excluded' | 'notes') => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }
  
  const addArrayItem = (field: 'highlights' | 'included' | 'excluded' | 'notes') => {
    const newArray = [...formData[field], '']
    setFormData({ ...formData, [field]: newArray })
  }
  
  const removeArrayItem = (index: number, field: 'highlights' | 'included' | 'excluded' | 'notes') => {
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
      if (!formData.name || !formData.price || !formData.category_id) {
        throw new Error('필수 필드를 모두 입력해주세요. (이름, 가격, 카테고리)')
      }
      
      // 배열 필드에서 빈 항목 필터링
      const highlights = formData.highlights.filter(item => item.trim() !== '')
      const included = formData.included.filter(item => item.trim() !== '')
      const excluded = formData.excluded.filter(item => item.trim() !== '')
      const notes = formData.notes.filter(item => item.trim() !== '')
      
      // 여행 일정 검증
      const itinerary = formData.itinerary.map(day => ({
        ...day,
        title: day.title.trim() || `Day ${day.day}`,
        description: day.description.trim()
      }))
      
      // 데이터베이스 업데이트 준비
      const supabase = createClient()
      
      // 데이터베이스 업데이트 시도 로그
      console.log("패키지 데이터 업데이트 시도:", {
        title: formData.name, 
        price: String(formData.price || 0), // 문자열로 변환
        region: formData.region,
        type: formData.category || formData.type
      });
      
      // 패키지 ID를 사용하여 업데이트
      const { error } = await supabase
        .from('packages')
        .update({
          title: formData.name, // 데이터베이스에서는 title 필드 사용
          price: String(formData.price || 0) as any, // 타입 단언으로 문자열 허용
          region: formData.region,
          region_ko: formData.regionKo || '',
          type: formData.category || formData.type, // 데이터베이스에는 type 필드가 있음
          description: formData.description || '',
          image: formData.image || '',
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          highlights: highlights.length ? highlights : [''],
          itinerary: itinerary || [{day: 1, title: '', description: '', accommodation: '', meals: {breakfast: false, lunch: false, dinner: false}}],
          included: included.length ? included : [''],
          excluded: excluded.length ? excluded : [''],
          notes: notes.length ? notes : [''],
          min_people: formData.min_people || 1,
          max_people: formData.max_people || 10
        })
        .eq('id', packageId)
      
      if (error) throw error
      
      // 성공 후 목록 페이지로 이동
      router.push('/admin/packages')
      router.refresh()
      
    } catch (error: any) {
      console.error('패키지 수정 실패:', error)
      setError(error.message || '패키지 수정 중 오류가 발생했습니다')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return (
    <div className="pb-12">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/admin/packages" className="mr-4 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">패키지 수정</h1>
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
                패키지 ID
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>
            
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
                메인 카테고리 <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">카테고리 선택</option>
                {mainCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                서브 카테고리
              </label>
              <select
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.category_id}
              >
                <option value="">서브 카테고리 선택</option>
                {filteredSubCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                대표 이미지 URL
              </label>
              <div className="flex">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              {formData.image && (
                <div className="mt-2 relative h-40 w-full md:w-1/3 border rounded-md overflow-hidden">
                  <img
                    src={formData.image}
                    alt="패키지 미리보기"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "https://via.placeholder.com/300x200?text=이미지+오류"
                    }}
                  />
                </div>
              )}
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
