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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                패키지명
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
                지역
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">지역 선택</option>
                <option value="southeast-asia">동남아시아</option>
                <option value="japan">일본</option>
                <option value="europe">유럽</option>
                <option value="americas">미주</option>
                <option value="guam-saipan">괌/사이판</option>
                <option value="taiwan-hongkong-macau">대만/홍콩/마카오</option>
                <option value="domestic">국내</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지역 (한국어)
              </label>
              <input
                type="text"
                name="regionKo"
                value={formData.regionKo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 동남아시아"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                여행 타입
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">타입 선택</option>
                <option value="package">패키지</option>
                <option value="hotel">호텔</option>
                <option value="luxury">럭셔리</option>
                <option value="resort">리조트</option>
                <option value="pool-villa">풀빌라</option>
              </select>
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

        {/* 이미지 업로드 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">패키지 이미지</h2>
          
          {/* 기존 이미지 */}
          {existingImages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3 text-gray-700">현재 이미지</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={imageUrl}
                        alt={`패키지 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 이미지 업로드 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 이미지 추가
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (최대 10MB)</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* 업로드된 새 이미지 미리보기 */}
          {imageFiles.length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-3 text-gray-700">새로 추가할 이미지</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`새 이미지 ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImageFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            disabled={isSaving || isUploading}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${(isSaving || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving || isUploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {isUploading ? '이미지 업로드 중...' : '저장 중...'}
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
