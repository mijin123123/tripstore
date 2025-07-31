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
          setFormData({
            name: packageData.title || '',
            price: parseInt(packageData.price) || 0,
            duration: packageData.duration || '',
            region: packageData.region || '',
            regionKo: packageData.region_ko || '',
            description: packageData.description || '',
            image: (packageData.images && packageData.images[0]) || '',
            images: packageData.images || [''],
            highlights: packageData.highlights || [''],
            departure: packageData.departure || '',
            type: packageData.type || '',
            min_people: packageData.min_people || 1,
            max_people: packageData.max_people || 10,
            itinerary: packageData.itinerary || '',
            included: packageData.included || [''],
            excluded: packageData.excluded || [''],
            notes: packageData.notes || [''],
            is_featured: packageData.is_featured || false,
            location: packageData.features?.location || '',
            category: `${packageData.type}-${packageData.region}` || ''
          })
        }
      } catch (error) {
        console.error('패키지를 불러오는데 실패했습니다:', error)
        setError('패키지를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (packageId) {
      fetchPackage()
    }
  }, [packageId])

  // 숫자를 천 단위 콤마 형식으로 변환하는 함수
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ko-KR')
  }

  // 이미지 업로드 함수
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImages(prev => [...prev, imageIndex])

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `packages/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('package-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('package-images')
        .getPublicUrl(filePath)

      if (imageIndex === -1) {
        // 대표 이미지
        setFormData(prev => ({ ...prev, image: publicUrl }))
      } else {
        // 추가 이미지
        const newImages = [...formData.images]
        newImages[imageIndex] = publicUrl
        setFormData(prev => ({ ...prev, images: newImages }))
      }
    } catch (error: any) {
      console.error('이미지 업로드 실패:', error)
      setError('이미지 업로드에 실패했습니다')
    } finally {
      setUploadingImages(prev => prev.filter(index => index !== imageIndex))
    }
  }

  // 여러 이미지 업로드 함수
  const handleMultipleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    for (const file of files) {
      const emptyIndex = formData.images.findIndex(img => img === '')
      if (emptyIndex === -1 && formData.images.length < 10) {
        // 빈 슬롯이 없으면 새로 추가
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
        await new Promise(resolve => setTimeout(resolve, 100)) // 상태 업데이트 대기
      }
      
      const targetIndex = emptyIndex !== -1 ? emptyIndex : formData.images.length - 1
      
      // 파일 업로드 시뮬레이션
      const fakeEvent = {
        target: { files: [file] }
      } as React.ChangeEvent<HTMLInputElement>
      
      await handleImageUpload(fakeEvent, targetIndex)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'price') {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      if (!formData.name) {
        throw new Error('패키지명은 필수 입력 항목입니다.')
      }
      
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
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          itinerary: formData.itinerary || '',
          min_people: formData.min_people || 1,
          max_people: formData.max_people || 10,
          images: formData.images.filter(img => img.trim() !== ''),
          highlights: formData.highlights.filter(h => h.trim() !== ''),
          included: formData.included.filter(i => i.trim() !== ''),
          excluded: formData.excluded.filter(e => e.trim() !== ''),
          notes: formData.notes.filter(n => n.trim() !== ''),
          features: { 
            location: formData.location || ''
          }
        })
        .eq('id', packageId)
      
      if (error) throw error
      
      console.log('패키지 수정 성공:', packageId)
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                패키지명
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="패키지명을 입력하세요"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                패키지 카테고리
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">카테고리를 선택하세요</option>
                <optgroup label="해외여행">
                  <option value="overseas-europe">유럽</option>
                  <option value="overseas-japan">일본</option>
                  <option value="overseas-southeast-asia">동남아시아</option>
                  <option value="overseas-americas">미주/캐나다/하와이</option>
                  <option value="overseas-taiwan-hongkong-macau">대만/홍콩/마카오</option>
                  <option value="overseas-guam-saipan">괌/사이판</option>
                </optgroup>
                <optgroup label="국내여행">
                  <option value="domestic-hotel">호텔/리조트</option>
                  <option value="domestic-pool-villa">풀빌라/펜션</option>
                </optgroup>
                <optgroup label="럭셔리여행">
                  <option value="luxury-europe">유럽</option>
                  <option value="luxury-japan">일본</option>
                  <option value="luxury-southeast-asia">동남아시아</option>
                  <option value="luxury-cruise">크루즈</option>
                  <option value="luxury-special-theme">이색테마</option>
                </optgroup>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 (원)
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최소 인원
              </label>
              <input
                type="number"
                name="min_people"
                value={formData.min_people}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 보홀, 세부"
              />
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
                placeholder="패키지에 대한 상세 설명을 입력하세요"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                여행 일정
              </label>
              <textarea
                name="itinerary"
                value={formData.itinerary}
                onChange={handleChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="간략한 여행 일정을 입력하세요"
              />
            </div>
            
            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                추천 패키지 (메인 페이지에 표시)
              </label>
            </div>
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
            
            {/* 대표 이미지 미리보기 */}
            {formData.image && (
              <div className="mt-3 relative">
                <div className="bg-gray-100 p-2 rounded-md">
                  <div className="text-xs text-gray-500 mb-1">미리보기:</div>
                  <div className="relative aspect-video overflow-hidden rounded-md border border-gray-300">
                    <img
                      src={formData.image}
                      alt="대표 이미지 미리보기"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // 이미지 로드 오류 시 대체 이미지나 메시지 표시
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x225?text=이미지+로드+오류';
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 추가 이미지들 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                추가 이미지 (최대 10장)
              </label>
              <div className="flex gap-2">
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
                <div key={index} className="mb-5">
                  <div className="flex items-center gap-3">
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
                  
                  {/* 추가 이미지 미리보기 */}
                  {image && (
                    <div className="mt-2 ml-9">
                      <div className="bg-gray-50 p-2 rounded-md inline-block">
                        <div className="relative w-24 h-24 overflow-hidden rounded-md border border-gray-300">
                          <img
                            src={image}
                            alt={`추가 이미지 ${index + 1} 미리보기`}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=오류';
                            }}
                          />
                        </div>
                      </div>
                    </div>
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
            
            {/* 이미지 갤러리 미리보기 */}
            {(formData.image || formData.images.some(img => img.trim() !== '')) && (
              <div className="mt-6 bg-gray-50 p-4 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">패키지 이미지 미리보기</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {/* 대표 이미지 */}
                  {formData.image && (
                    <div className="relative w-16 h-16 overflow-hidden rounded-md border-2 border-blue-300 ring-1 ring-blue-100">
                      <img
                        src={formData.image}
                        alt="대표 이미지"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=대표';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-blue-500 text-white text-xs px-1 py-0.5 text-center">대표</div>
                    </div>
                  )}
                  
                  {/* 추가 이미지들 */}
                  {formData.images
                    .filter(img => img.trim() !== '')
                    .map((img, i) => (
                      <div key={`gallery-${i}`} className="relative w-16 h-16 overflow-hidden rounded-md border border-gray-300">
                        <img
                          src={img}
                          alt={`추가 이미지 ${i + 1}`}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=' + (i + 1);
                          }}
                        />
                        <div className="absolute top-0 right-0 bg-gray-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-bl-md">{i + 1}</div>
                      </div>
                    ))
                  }
                </div>
              </div>
            )}
          </div>
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
