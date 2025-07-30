'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save } from 'lucide-react'
import Link from 'next/link'

export default function EditPackage() {
  const router = useRouter()
  const params = useParams()
  const packageId = params?.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImages, setUploadingImages] = useState<number[]>([])

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: 0,
    duration: '',
    region: '',
    regionKo: '',
    description: '',
    image: '',
    images: [''],
    departure: '',
    type: '',
    min_people: 1,
    max_people: 10,
    itinerary: '',
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
          const pkg = packageData as any;
          
          // 기존 type과 region으로부터 category 값 생성
          let categoryValue = '';
          if (pkg.type && pkg.region) {
            categoryValue = `${pkg.type}-${pkg.region}`;
          }
          
          const featuresImages = pkg.features?.images || pkg.features?.all_images || pkg.features?.additional_images || [];
          const mainImage = pkg.image || '';
          
          let allImages = [];
          if (featuresImages.length > 0) {
            allImages = featuresImages;
          } else if (mainImage) {
            allImages = [mainImage];
          } else {
            allImages = [''];
          }
          
          const location = pkg.features?.location || '';
          
          // itinerary 데이터 처리 - 문자열로 변환
          let itineraryString = '';
          
          if (Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0) {
            // 배열 형태의 일정을 문자열로 변환
            itineraryString = pkg.itinerary.map((item: any) => 
              `Day ${item.day}: ${item.title || ''}\n${item.description || ''}`
            ).join('\n\n');
          } else if (typeof pkg.itinerary === 'string' && pkg.itinerary.trim()) {
            // 이미 문자열인 경우 그대로 사용
            itineraryString = pkg.itinerary;
          }
          
          setFormData({
            id: pkg.id || '',
            name: pkg.title || '',
            price: parseInt(pkg.price) || 0,
            region: pkg.region || '',
            regionKo: pkg.region_ko || '',
            description: pkg.description || '',
            image: mainImage,
            images: allImages.length > 0 ? allImages : [''],
            departure: pkg.departure || '',
            type: pkg.type || '',
            min_people: pkg.min_people || 1,
            max_people: pkg.max_people || 10,
            itinerary: itineraryString,
            included: Array.isArray(pkg.included) ? pkg.included : [''],
            excluded: Array.isArray(pkg.excluded) ? pkg.excluded : [''],
            notes: Array.isArray(pkg.notes) ? pkg.notes : [''],
            is_featured: pkg.is_featured || false,
            start_date: pkg.start_date || '',
            end_date: pkg.end_date || '',
            duration: pkg.duration || '',
            location: location,
            category: categoryValue
          })
        }
      } catch (error) {
        console.error('패키지를 불러오는데 실패했습니다:', error)
        setError('패키지를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPackage()
  }, [packageId])

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

  const handleArrayChange = (index: number, value: string, field: 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({ ...formData, [field]: newArray })
  }

  const addArrayItem = (field: 'included' | 'excluded' | 'notes' | 'images') => {
    if (field === 'images' && formData.images.length >= 10) {
      alert('이미지는 최대 10개까지만 추가할 수 있습니다.');
      return;
    }
    const newArray = [...formData[field], '']
    setFormData({ ...formData, [field]: newArray })
  }

  const removeArrayItem = (index: number, field: 'included' | 'excluded' | 'notes' | 'images') => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({ ...formData, [field]: newArray })
  }

  // 파일 업로드 처리 함수
  const handleFileUpload = async (file: File, index: number): Promise<void> => {
    if (!file) return

    // 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
    if (!allowedTypes.includes(file.type)) {
      alert('JPG, PNG, WebP, GIF, AVIF 파일만 업로드 가능합니다.')
      return
    }

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하로 제한됩니다.')
      return
    }

    try {
      setUploadingImages(prev => [...prev, index])
      
      const supabase = createClient()
      
      // 현재 사용자 확인
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('사용자 인증 실패:', userError)
        alert('로그인이 필요합니다.')
        return
      }

      console.log('현재 사용자:', user.email)
      
      // 파일명 생성 (타임스탬프 + 랜덤 문자열)
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `packages/${fileName}`

      console.log('업로드 시도:', {
        fileName,
        filePath,
        fileSize: file.size,
        fileType: file.type,
        targetIndex: index
      })

      // Supabase Storage에 파일 업로드
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        })

      if (error) {
        console.error('파일 업로드 실패:', {
          error,
          message: error.message,
          statusCode: error.statusCode
        })
        
        if (error.message?.includes('already exists')) {
          alert('같은 이름의 파일이 이미 존재합니다. 다시 시도해주세요.')
        } else if (error.message?.includes('not allowed')) {
          alert('파일 형식이 허용되지 않습니다.')
        } else if (error.message?.includes('size')) {
          alert('파일 크기가 너무 큽니다.')
        } else {
          alert(`파일 업로드에 실패했습니다: ${error.message}`)
        }
        return
      }

      console.log('업로드 성공:', data)

      // 업로드된 파일의 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      console.log('공개 URL:', publicUrl)

      // 폼 데이터 업데이트 (함수형 업데이트로 최신 상태 보장)
      setFormData(prev => {
        const newImages = [...prev.images]
        newImages[index] = publicUrl
        return { ...prev, images: newImages }
      })

      console.log(`이미지 ${index + 1} 업로드 완료:`, publicUrl)

    } catch (error) {
      console.error('파일 업로드 중 오류:', error)
      alert(`파일 업로드 중 오류가 발생했습니다: ${error}`)
    } finally {
      setUploadingImages(prev => prev.filter(i => i !== index))
    }
  }

  const handleItineraryChange = (value: string) => {
    setFormData({ ...formData, itinerary: value })
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
      const included = formData.included.filter(item => item.trim() !== '')
      const excluded = formData.excluded.filter(item => item.trim() !== '')
      const notes = formData.notes.filter(item => item.trim() !== '')
      const images = formData.images.filter(item => item.trim() !== '')
      
      const supabase = createClient()
      
      const { error } = await supabase
        .from('packages')
        .update({
          title: formData.name,
          price: formData.price.toString(),
          region: formData.region,
          region_ko: formData.regionKo || '',
          type: formData.type,
          description: formData.description || '',
          image: images.length > 0 ? images[0] : formData.image || '',
          images: images,
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          itinerary: formData.itinerary,
          included: included.length ? included : [''],
          excluded: excluded.length ? excluded : [''],
          notes: notes.length ? notes : [''],
          min_people: formData.min_people || 1,
          max_people: formData.max_people || 10,
          features: { 
            location: formData.location || ''
          }
        })
        .eq('id', packageId)
      
      if (error) throw error
      
      console.log('패키지 수정 성공:', packageId)
      
      // 성공 후 패키지 목록으로 이동
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
      <div className="mb-8 flex items-center">
        <Link href="/admin/packages" className="mr-4 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">패키지 수정</h1>
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
                placeholder="예: 인천국제공항"
              />
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
                placeholder="예: 서울"
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
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  패키지 이미지
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
                <div key={index} className="flex items-center gap-3 mb-3">
                  <span className="text-sm text-gray-500 min-w-[20px]">{index + 1}.</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이미지 URL 또는 파일 업로드"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file, index)
                        e.target.value = ''
                      }
                    }}
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
                      onClick={() => removeArrayItem(index, 'images')}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              
              <p className="text-xs text-gray-500 mt-2">
                • 첫 번째 이미지가 메인 이미지로 사용됩니다.<br/>
                • 이미지 파일 크기는 5MB 이하로 제한됩니다.<br/>
                • 지원 형식: JPEG, PNG, WebP, GIF, AVIF<br/>
                • 이미지는 최대 10개까지 추가 가능합니다.
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
        
        {/* 여행 일정 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="itinerary-section">
          <h2 className="text-lg font-semibold mb-4">여행 일정</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              간략 일정 
              <span className="text-gray-500 text-xs ml-1">(예: 3박 4일, 아시아나항공, 하노이-사파-하이퐁(1))</span>
            </label>
            <textarea
              value={formData.itinerary}
              onChange={(e) => handleItineraryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="간략한 여행 일정을 입력하세요&#10;예: 3박 4일&#10;아시아나항공&#10;하노이-사파-하이퐁(1)"
            />
          </div>
        </div>

        {/* 포함 사항 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="included-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">포함 사항</h2>
            <button
              type="button"
              onClick={() => addArrayItem('included')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} className="mr-1" /> 항목 추가
            </button>
          </div>
          
          {formData.included.map((item, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, 'included')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="포함되는 항목을 입력하세요"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'included')}
                className="ml-3 p-2 text-red-600 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* 불포함 사항 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="excluded-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">불포함 사항</h2>
            <button
              type="button"
              onClick={() => addArrayItem('excluded')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} className="mr-1" /> 항목 추가
            </button>
          </div>
          
          {formData.excluded.map((item, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(index, e.target.value, 'excluded')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="포함되지 않는 항목을 입력하세요"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'excluded')}
                className="ml-3 p-2 text-red-600 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* 예약 시 참고사항 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200" id="notes-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">예약 시 참고사항</h2>
            <button
              type="button"
              onClick={() => addArrayItem('notes')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} className="mr-1" /> 항목 추가
            </button>
          </div>
          
          {formData.notes.map((note, index) => (
            <div key={index} className="flex mb-3">
              <input
                type="text"
                value={note}
                onChange={(e) => handleArrayChange(index, e.target.value, 'notes')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="주의사항이나 참고할 내용을 입력하세요"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'notes')}
                className="ml-3 p-2 text-red-600 hover:text-red-700"
              >
                <X size={16} />
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
                <Save size={18} className="mr-2" /> 패키지 수정
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
