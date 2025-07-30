'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Plus, X, Save, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'
import Link from 'next/link'

export default function EditPackage() {
  const router = useRouter()
  const params = useParams()
  const packageId = params?.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [packageLoaded, setPackageLoaded] = useState(false)
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
    images: [''], // 여러 이미지를 위한 배열
    highlights: [''],
    departure: '',
    type: '',
    min_people: 1,
    max_people: 10,
    itinerary: '', // 문자열로 변경
    included: [''],
    excluded: [''],
    notes: [''],
    is_featured: false,
    start_date: '',
    end_date: '',
    location: ''
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
            highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [''],
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
            location: location
          })
          
          setPackageLoaded(true)
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

  // 이미지 파일을 Base64로 변환하는 함수
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // 일정 텍스트에 이미지 붙여넣기 핸들러
  const handleItineraryPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // 이미지 파일인 경우
      if (item.type.startsWith('image/')) {
        e.preventDefault(); // 기본 붙여넣기 방지
        
        const file = item.getAsFile();
        if (file) {
          try {
            const base64 = await convertToBase64(file);
            const currentValue = formData.itinerary;
            const textarea = e.target as HTMLTextAreaElement;
            const startPos = textarea.selectionStart;
            const endPos = textarea.selectionEnd;
            
            // 이미지 마크다운 문법으로 삽입
            const imageMarkdown = `![이미지](${base64})`;
            const newValue = currentValue.substring(0, startPos) + imageMarkdown + currentValue.substring(endPos);
            
            handleItineraryChange(newValue);
            
            // 커서 위치를 이미지 태그 뒤로 이동
            setTimeout(() => {
              textarea.selectionStart = textarea.selectionEnd = startPos + imageMarkdown.length;
              textarea.focus();
            }, 0);
          } catch (error) {
            console.error('이미지 변환 실패:', error);
            alert('이미지 처리 중 오류가 발생했습니다.');
          }
        }
        break;
      }
    }
  };

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
    } else if (name === 'region') {
      // 지역 변경 시 regionKo 자동 설정
      let newRegionKo = '';
      
      if (value === 'europe') {
        newRegionKo = '유럽';
      } else if (value === 'japan') {
        newRegionKo = '일본';
      } else if (value === 'southeast-asia') {
        newRegionKo = '동남아';
      } else if (value === 'americas') {
        newRegionKo = '미주/캐나다/하와이';
      } else if (value === 'taiwan-hongkong-macau') {
        newRegionKo = '대만/홍콩/마카오';
      } else if (value === 'guam-saipan') {
        newRegionKo = '괌/사이판';
      } else if (value === 'hotel') {
        newRegionKo = '호텔/리조트';
      } else if (value === 'pool-villa') {
        newRegionKo = '풀빌라/펜션';
      } else if (value === 'cruise') {
        newRegionKo = '크루즈';
      } else if (value === 'special-theme') {
        newRegionKo = '이색테마';
      }
      
      setFormData({ 
        ...formData, 
        [name]: value,
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

  // 이미지 순서 조정 함수들
  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = [...formData.images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    setFormData({ ...formData, images: newImages })
  }

  const moveImageDown = (index: number) => {
    if (index === formData.images.length - 1) return
    const newImages = [...formData.images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    setFormData({ ...formData, images: newImages })
  }

  // 드래그 앤 드롭 관련 상태
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newImages = [...formData.images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, draggedImage)
    
    setFormData({ ...formData, images: newImages })
    setDraggedIndex(null)
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
      if (!formData.name || !formData.price || !formData.type || !formData.region) {
        throw new Error('필수 필드를 모두 입력해주세요. (이름, 가격, 타입, 지역)')
      }
      
      // 배열 필드에서 빈 항목 필터링
      const highlights = formData.highlights.filter(item => item.trim() !== '')
      const included = formData.included.filter(item => item.trim() !== '')
      const excluded = formData.excluded.filter(item => item.trim() !== '')
      const notes = formData.notes.filter(item => item.trim() !== '')
      const images = formData.images.filter(item => item.trim() !== '')
      
      // 여행 일정은 문자열로 저장
      const itinerary = formData.itinerary || ''
      
      // 데이터베이스 업데이트 준비
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
          images: images, // 이미지 배열 저장
          is_featured: formData.is_featured,
          duration: formData.duration || '',
          departure: formData.departure || '',
          highlights: highlights.length ? highlights : [''],
          itinerary: itinerary || '',
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
      setError(error.message || '패키지 생성 중 오류가 발생했습니다')
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
        <div className="flex space-x-2">
          <a href="#itinerary-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            상세 일정
          </a>
          <a href="#included-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            포함 사항
          </a>
          <a href="#excluded-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            불포함 사항
          </a>
          <a href="#notes-section" className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm hover:bg-blue-100">
            참고사항
          </a>
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
                타입 <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">타입 선택</option>
                <option value="overseas">해외여행</option>
                <option value="domestic">국내여행</option>
                <option value="luxury">럭셔리</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지역 <span className="text-red-500">*</span>
              </label>
              <select
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">지역 선택</option>
                {formData.type === 'overseas' && (
                  <>
                    <option value="europe">유럽</option>
                    <option value="japan">일본</option>
                    <option value="southeast-asia">동남아</option>
                    <option value="americas">미주/캐나다/하와이</option>
                    <option value="taiwan-hongkong-macau">대만/홍콩/마카오</option>
                    <option value="guam-saipan">괌/사이판</option>
                  </>
                )}
                {formData.type === 'domestic' && (
                  <>
                    <option value="hotel">호텔/리조트</option>
                    <option value="pool-villa">풀빌라/펜션</option>
                  </>
                )}
                {formData.type === 'luxury' && (
                  <>
                    <option value="europe">유럽</option>
                    <option value="japan">일본</option>
                    <option value="southeast-asia">동남아</option>
                    <option value="cruise">크루즈</option>
                    <option value="special-theme">이색테마</option>
                  </>
                )}
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
              ></textarea>
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
              
              {/* 다중 파일 업로드 섹션 */}
              <div className="mb-3 p-3 border border-dashed border-gray-300 rounded-md bg-gray-50">
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length > 0) {
                        console.log(`${files.length}개 파일 선택됨`)
                        
                        // 현재 사용된 슬롯 개수 확인
                        const usedSlots = formData.images.filter(img => img.trim()).length
                        
                        // 최대 10개 제한 확인
                        if (usedSlots + files.length > 10) {
                          alert(`이미지는 최대 10개까지만 업로드 가능합니다. 현재 ${usedSlots}개 등록됨, ${files.length}개 선택됨`)
                          e.target.value = ''
                          return
                        }
                        
                        // 필요한 만큼 이미지 슬롯 확보
                        const currentImages = [...formData.images]
                        while (currentImages.length < usedSlots + files.length) {
                          currentImages.push('')
                        }
                        
                        // 상태 업데이트
                        setFormData(prev => ({ ...prev, images: currentImages }))
                        
                        // 순차적으로 파일 업로드
                        let uploadIndex = 0
                        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
                          const file = files[fileIndex]
                          try {
                            // 빈 슬롯 찾기
                            while (uploadIndex < currentImages.length && currentImages[uploadIndex].trim() !== '') {
                              uploadIndex++
                            }
                            
                            if (uploadIndex < 10) {
                              console.log(`파일 ${fileIndex + 1}/${files.length} 업로드 시작 (슬롯 ${uploadIndex})`)
                              await handleFileUpload(file, uploadIndex)
                              // 업로드 완료 후 해당 슬롯을 사용됨으로 표시
                              currentImages[uploadIndex] = 'uploading' // 임시 표시
                              uploadIndex++
                            }
                          } catch (error) {
                            console.error(`파일 ${fileIndex + 1} 업로드 실패:`, error)
                          }
                        }
                        
                        e.target.value = '' // 입력 초기화
                        console.log('모든 파일 업로드 완료')
                      }
                    }}
                    className="hidden"
                    id="multipleFileUpload"
                    disabled={uploadingImages.length > 0}
                  />
                  <label 
                    htmlFor="multipleFileUpload" 
                    className={`cursor-pointer inline-flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                      uploadingImages.length > 0 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Plus size={14} className="mr-1" />
                    {uploadingImages.length > 0 ? '업로드 중...' : '여러 이미지 한번에 업로드'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    최대 10개까지 선택 가능 (각 파일 5MB 이하)
                    {uploadingImages.length > 0 && (
                      <span className="text-blue-600 block mt-1">
                        업로드 진행 중: {uploadingImages.length}개
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {formData.images.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 border rounded-md transition-all ${
                    draggedIndex === index ? 'opacity-50' : ''
                  } ${draggedIndex !== null && draggedIndex !== index ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-center space-x-2">
                    {/* 드래그 핸들 및 순서 조정 버튼 */}
                    <div className="flex flex-col items-center space-y-1">
                      <GripVertical size={12} className="text-gray-400 cursor-move" />
                      <div className="flex flex-col space-y-0.5">
                        <button
                          type="button"
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className={`p-0.5 rounded ${
                            index === 0 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <ChevronUp size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImageDown(index)}
                          disabled={index === formData.images.length - 1}
                          className={`p-0.5 rounded ${
                            index === formData.images.length - 1 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          <ChevronDown size={10} />
                        </button>
                      </div>
                    </div>

                    {/* 이미지 프리뷰 */}
                    <div className="flex-shrink-0">
                      {imageUrl && (
                        <div className="relative h-20 w-28 border rounded overflow-hidden bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={`패키지 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              if (!target.dataset.retried) {
                                target.dataset.retried = 'true'
                                setTimeout(() => {
                                  target.src = imageUrl + '?t=' + Date.now()
                                }, 1000)
                              } else {
                                target.src = "https://via.placeholder.com/300x200?text=이미지+로딩+실패"
                              }
                            }}
                            onLoad={() => {
                              console.log(`이미지 ${index + 1} 로딩 성공:`, imageUrl.substring(0, 50) + '...')
                            }}
                          />
                          {index === 0 && (
                            <div className="absolute top-0.5 left-0.5 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                              메인
                            </div>
                          )}
                          <div className="absolute top-0.5 right-0.5 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                            {index + 1}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 파일 업로드 및 URL */}
                    <div className="flex-1 min-w-0 max-w-md">
                      <div className="flex items-center space-x-1 mb-1">
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
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          disabled={uploadingImages.includes(index)}
                        />
                        
                        {/* 삭제 버튼 */}
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, 'images')}
                          className="px-2 py-1 border border-gray-300 rounded text-red-600 hover:text-red-800 hover:bg-red-50"
                          disabled={formData.images.length <= 1}
                        >
                          <X size={12} />
                        </button>
                      </div>

                      {/* 이미지 URL 편집 */}
                      {imageUrl && (
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => handleArrayChange(index, e.target.value, 'images')}
                          className="w-full max-w-sm px-1 py-0.5 border border-gray-200 rounded text-xs text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-300"
                          placeholder="이미지 URL"
                          readOnly={uploadingImages.includes(index)}
                        />
                      )}

                      {/* 업로드 상태 표시 */}
                      {uploadingImages.includes(index) && (
                        <div className="text-xs text-blue-600 mt-1 flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                          업로드 중...
                        </div>
                      )}
                      
                      {formData.images[index] && formData.images[index].trim() !== '' && !uploadingImages.includes(index) && (
                        <div className="text-xs text-green-600 mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          완료
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <p className="text-xs text-gray-500 mt-4">
                • 첫 번째 이미지가 메인 이미지로 사용됩니다.<br/>
                • 드래그하거나 위/아래 버튼으로 이미지 순서를 변경할 수 있습니다.<br/>
                • "여러 이미지 한번에 업로드" 버튼으로 최대 10개까지 선택하여 한번에 업로드 가능<br/>
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
              onPaste={handleItineraryPaste}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="간략한 여행 일정을 입력하세요&#10;예: 3박 4일&#10;아시아나항공&#10;하노이-사파-하이퐁(1)&#10;&#10;📷 이미지도 붙여넣기 가능합니다!"
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
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> 추가
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
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.included.length <= 1}
              >
                <X size={20} />
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
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> 추가
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
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.excluded.length <= 1}
              >
                <X size={20} />
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
              className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
            >
              <Plus size={16} className="mr-1" /> 추가
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
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={formData.notes.length <= 1}
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
                <Save size={18} className="mr-2" /> 패키지 생성
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}