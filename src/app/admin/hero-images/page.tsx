'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Database } from '@/types/database.types'
import { Edit, Plus, Save, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

type HeroImage = {
  id: number
  page_type: string
  page_slug: string | null
  title: string
  subtitle: string | null
  image_url: string
  gradient_overlay: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function HeroImagesPage() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Omit<HeroImage, 'id' | 'created_at' | 'updated_at'>>({
    page_type: '',
    page_slug: '',
    title: '',
    subtitle: '',
    image_url: '',
    gradient_overlay: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%)',
    is_active: true
  })

  // 페이지 타입 옵션
  const pageTypeOptions = [
    { value: 'main', label: '메인 페이지' },
    { value: 'overseas', label: '해외 여행' },
    { value: 'domestic', label: '국내 여행' },
    { value: 'luxury', label: '럭셔리 여행' },
    { value: 'hotel', label: '호텔' }
  ]

  // 페이지 슬러그 옵션 (페이지 타입에 따라 동적으로 변경)
  const getPageSlugOptions = (pageType: string) => {
    switch (pageType) {
      case 'overseas':
        return [
          { value: '', label: '전체' },
          { value: 'europe', label: '유럽' },
          { value: 'japan', label: '일본' },
          { value: 'southeast-asia', label: '동남아시아' },
          { value: 'americas', label: '아메리카' },
          { value: 'guam-saipan', label: '괌/사이판' },
          { value: 'china-hongkong', label: '중국/홍콩' }
        ]
      case 'domestic':
        return [
          { value: '', label: '전체' },
          { value: 'hotel', label: '호텔' },
          { value: 'pool-villa', label: '풀빌라' },
          { value: 'resort', label: '리조트' }
        ]
      case 'luxury':
        return [
          { value: '', label: '전체' },
          { value: 'europe', label: '유럽' },
          { value: 'japan', label: '일본' },
          { value: 'southeast-asia', label: '동남아시아' },
          { value: 'cruise', label: '크루즈' },
          { value: 'special-theme', label: '특별 테마' }
        ]
      case 'hotel':
        return [
          { value: '', label: '전체' },
          { value: 'europe', label: '유럽' },
          { value: 'japan', label: '일본' },
          { value: 'southeast-asia', label: '동남아시아' },
          { value: 'americas', label: '아메리카' },
          { value: 'china-hongkong', label: '중국/홍콩' },
          { value: 'guam-saipan', label: '괌/사이판' }
        ]
      default:
        return [{ value: '', label: '전체' }]
    }
  }

  useEffect(() => {
    fetchHeroImages()
  }, [])

  const fetchHeroImages = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('page_type')
        .order('page_slug', { nullsFirst: true })
        
      if (error) throw error
      setHeroImages(data as HeroImage[] || [])
    } catch (err: any) {
      console.error('히어로 이미지 불러오기 오류:', err)
      setError(`히어로 이미지를 불러오는데 실패했습니다: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = async (file: File) => {
    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.')
      return
    }

    try {
      setUploadingImage(true)
      setError(null)

      // 파일 미리보기 생성
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      const supabase = await createClient()
      
      // 파일명 생성 (타임스탬프 + 안전한 파일명)
      const timestamp = Date.now()
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `hero-${timestamp}-${safeName}`
      
      // 직접 업로드 시도 (에러 처리는 catch에서)
      const { data, error: uploadError } = await supabase.storage
        .from('hero-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        console.error('업로드 에러:', uploadError)
        throw new Error(`업로드 실패: ${uploadError.message}`)
      }
      
      if (!data) {
        throw new Error('업로드 결과 데이터가 없습니다.')
      }
      
      // 업로드된 파일의 public URL 생성
      const { data: { publicUrl } } = supabase.storage
        .from('hero-images')
        .getPublicUrl(fileName)
      
      if (!publicUrl) {
        throw new Error('Public URL 생성에 실패했습니다.')
      }
      
      // 폼 데이터 업데이트
      setFormData(prev => ({ ...prev, image_url: publicUrl }))
      console.log('이미지 업로드 성공:', publicUrl)
      
    } catch (err: any) {
      console.error('이미지 업로드 오류:', err)
      setError(`이미지 업로드에 실패했습니다: ${err.message}`)
      setPreviewImage(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleImageUpload(files[0])
    }
  }

  const handleEdit = (heroImage: HeroImage) => {
    setEditingId(heroImage.id)
    setFormData({
      page_type: heroImage.page_type,
      page_slug: heroImage.page_slug || '',
      title: heroImage.title,
      subtitle: heroImage.subtitle || '',
      image_url: heroImage.image_url,
      gradient_overlay: heroImage.gradient_overlay,
      is_active: heroImage.is_active
    })
    setPreviewImage(heroImage.image_url)
    window.scrollTo(0, 0)
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      page_type: '',
      page_slug: '',
      title: '',
      subtitle: '',
      image_url: '',
      gradient_overlay: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%)',
      is_active: true
    })
    setPreviewImage(null)
    window.scrollTo(0, 0)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setEditingId(null)
    setFormData({
      page_type: '',
      page_slug: '',
      title: '',
      subtitle: '',
      image_url: '',
      gradient_overlay: 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%)',
      is_active: true
    })
    setPreviewImage(null)
  }

  const handleSave = async () => {
    try {
      if (!formData.page_type || !formData.title || (!formData.image_url && !previewImage)) {
        setError('페이지 타입, 제목, 이미지는 필수 항목입니다.')
        return
      }

      const supabase = await createClient()
      
      if (editingId) {
        // 편집 모드
        const { error } = await supabase
          .from('hero_images')
          .update({
            page_type: formData.page_type,
            page_slug: formData.page_slug || null,
            title: formData.title,
            subtitle: formData.subtitle || null,
            image_url: formData.image_url,
            gradient_overlay: formData.gradient_overlay,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
        
        if (error) throw error
      } else {
        // 새로 생성 모드
        const { error } = await supabase
          .from('hero_images')
          .insert({
            page_type: formData.page_type,
            page_slug: formData.page_slug || null,
            title: formData.title,
            subtitle: formData.subtitle || null,
            image_url: formData.image_url,
            gradient_overlay: formData.gradient_overlay,
            is_active: formData.is_active
          })
        
        if (error) throw error
      }
      
      setIsCreating(false)
      setEditingId(null)
      setPreviewImage(null)
      await fetchHeroImages()
    } catch (err: any) {
      setError(`히어로 이미지 저장에 실패했습니다: ${err.message}`)
      console.error('히어로 이미지 저장 오류:', err)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 히어로 이미지를 삭제하시겠습니까?')) {
      return
    }
    
    try {
      const supabase = await createClient()
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      await fetchHeroImages()
    } catch (err: any) {
      setError(`히어로 이미지 삭제에 실패했습니다: ${err.message}`)
      console.error('히어로 이미지 삭제 오류:', err)
    }
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">히어로 이미지 관리</h1>
        {!isCreating && !editingId && (
          <button 
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-1" />
            새 히어로 이미지
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* 편집 또는 새로 생성 폼 */}
      {(isCreating || editingId) && (
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {isCreating ? '새 히어로 이미지 추가' : '히어로 이미지 편집'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">페이지 타입 <span className="text-red-500">*</span></label>
              <select
                name="page_type"
                value={formData.page_type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">페이지 타입 선택</option>
                {pageTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">페이지 슬러그</label>
              <select
                name="page_slug"
                value={formData.page_slug || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={formData.page_type === 'main'}
              >
                {getPageSlugOptions(formData.page_type).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">메인 페이지는 슬러그가 필요 없습니다</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목 입력"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="부제목 입력 (선택사항)"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">히어로 이미지 <span className="text-red-500">*</span></label>
              
              {/* 파일 업로드 영역 */}
              <div className="mt-2">
                <div 
                  className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="미리보기"
                          className="mx-auto h-32 w-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null)
                            setFormData(prev => ({ ...prev, image_url: '' }))
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="hero-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>{previewImage ? '다른 이미지 선택' : '파일을 선택하거나'}</span>
                        <input
                          id="hero-image-upload"
                          name="hero-image-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleFileInputChange}
                          disabled={uploadingImage}
                        />
                      </label>
                      {!previewImage && <p className="pl-1">여기에 드래그하세요</p>}
                    </div>
                    
                    {!previewImage && (
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG, WEBP 파일 (최대 5MB)
                      </p>
                    )}
                    
                    {uploadingImage && (
                      <div className="flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                        <span className="ml-2 text-sm text-gray-600">업로드 중...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* URL 직접 입력 옵션 (선택사항) */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">또는 이미지 URL 직접 입력</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/images/[category]-hero.jpg 또는 https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  파일 업로드 대신 기존 이미지 URL을 직접 입력할 수 있습니다
                </p>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">그라데이션 오버레이</label>
              <input
                type="text"
                name="gradient_overlay"
                value={formData.gradient_overlay}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%)"
              />
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">활성화</label>
              </div>
            </div>
          </div>
          
          {(previewImage || formData.image_url) && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">이미지 미리보기:</p>
              <div className="relative h-48 w-full overflow-hidden rounded-lg" 
                style={{ background: formData.gradient_overlay }}>
                <div className="absolute inset-0" style={{ backgroundImage: `url(${previewImage || formData.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1 }} />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold">{formData.title}</h3>
                    {formData.subtitle && <p className="mt-2">{formData.subtitle}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex space-x-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
            >
              <Save className="h-5 w-5 mr-1" />
              저장
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
            >
              <X className="h-5 w-5 mr-1" />
              취소
            </button>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    페이지 타입
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    슬러그
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이미지
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heroImages.map(heroImage => (
                  <tr key={heroImage.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {heroImage.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {heroImage.page_type === 'main' ? '메인 페이지' : 
                         heroImage.page_type === 'overseas' ? '해외 여행' :
                         heroImage.page_type === 'domestic' ? '국내 여행' :
                         heroImage.page_type === 'luxury' ? '럭셔리 여행' :
                         heroImage.page_type === 'hotel' ? '호텔' : heroImage.page_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {heroImage.page_slug || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {heroImage.title}
                      {heroImage.subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{heroImage.subtitle}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="h-10 w-10 rounded overflow-hidden bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={heroImage.image_url} 
                          alt={heroImage.title} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=이미지+없음";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {heroImage.is_active ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          활성
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          비활성
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(heroImage)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(heroImage.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {heroImages.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500">
                      히어로 이미지가 없습니다. 새로운 히어로 이미지를 추가해 주세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
