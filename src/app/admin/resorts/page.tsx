'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Search, Edit, Trash2, Star, Save, Users, Palmtree, Map } from 'lucide-react'

type Resort = {
  id: string
  name: string
  location: string
  image: string
  rating: number
  price: string
  amenities: string[]
  region_id: number
  description: string | null
  max_people: number | null
  has_beach_access: boolean | null
  has_pool: boolean | null
  is_featured: boolean
  regions?: {
    name: string
  }
}

type Region = {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
}

export default function AdminResorts() {
  const [resorts, setResorts] = useState<Resort[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentResort, setCurrentResort] = useState<Resort | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    image: '',
    rating: 4.5,
    price: '',
    amenities: [''],
    region_id: 0,
    description: '',
    max_people: 2,
    has_beach_access: false,
    has_pool: false,
    is_featured: false
  })
  
  useEffect(() => {
    fetchResortsAndRegions()
  }, [])
  
  const fetchResortsAndRegions = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      // 리조트 데이터 가져오기
      const { data: resortData, error: resortError } = await supabase
        .from('resorts')
        .select('*, regions!resorts_region_id_fkey(name)')
        .order('created_at', { ascending: false })
      
      if (resortError) throw resortError
      
      // 국내 카테고리 데이터 가져오기 (국내와 그 하위 카테고리들)
      const { data: regionData, error: regionError } = await supabase
        .from('categories')
        .select('id, name, slug, description, image, parent_id, created_at, updated_at')
        .in('id', [3, 31, 32, 33]) // 국내(3) + 국내 서브카테고리(31~33: 호텔, 리조트, 풀빌라)
        .order('id', { ascending: true })
      
      if (regionError) throw regionError
      
      setResorts(resortData as any || [])
      setRegions(regionData || [])
    } catch (error) {
      console.error('데이터를 가져오는 데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredResorts = resorts.filter(resort => 
    resort.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resort.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resort.regions?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }
  
  const openAddModal = () => {
    setFormData({
      id: '',
      name: '',
      location: '',
      image: '',
      rating: 4.5,
      price: '',
      amenities: [''],
      region_id: regions.length > 0 ? regions[0].id : 0,
      description: '',
      max_people: 2,
      has_beach_access: false,
      has_pool: false,
      is_featured: false
    })
    setShowAddModal(true)
  }
  
  const openEditModal = (resort: Resort) => {
    setCurrentResort(resort)
    setFormData({
      id: resort.id,
      name: resort.name,
      location: resort.location,
      image: resort.image,
      rating: resort.rating,
      price: resort.price,
      amenities: resort.amenities || [''],
      region_id: resort.region_id,
      description: resort.description || '',
      max_people: resort.max_people || 2,
      has_beach_access: resort.has_beach_access || false,
      has_pool: resort.has_pool || false,
      is_featured: resort.is_featured
    })
    setShowEditModal(true)
  }
  
  const closeModal = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setCurrentResort(null)
    setImageUploading(false)
    setError('')
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }))
    } else if (name === 'max_people') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleAmenityChange = (index: number, value: string) => {
    const updatedAmenities = [...formData.amenities]
    updatedAmenities[index] = value
    setFormData(prev => ({ ...prev, amenities: updatedAmenities }))
  }
  
  const addAmenityField = () => {
    setFormData(prev => ({
      ...prev,
      amenities: [...prev.amenities, '']
    }))
  }
  
  const removeAmenityField = (index: number) => {
    if (formData.amenities.length > 1) {
      const updatedAmenities = formData.amenities.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, amenities: updatedAmenities }))
    }
  }
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    
    try {
      setImageUploading(true)
      const file = e.target.files[0]
      const supabase = createClient()
      
      // 파일 이름 중복 방지를 위한 타임스탬프 추가
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `resorts/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('travel-images')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      // 이미지 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('travel-images')
        .getPublicUrl(filePath)
      
      setFormData(prev => ({ ...prev, image: publicUrl }))
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      setError('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setImageUploading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    try {
      const supabase = createClient()
      
      // 빈 값이 있는지 검증
      const { name, location, image, price, region_id } = formData
      if (!name || !location || !image || !price || !region_id) {
        throw new Error('필수 항목을 모두 입력해주세요.')
      }
      
      // 빈 어메니티 제거
      const filteredAmenities = formData.amenities.filter(a => a.trim() !== '')
      
      if (showAddModal) {
        // 새 리조트 추가
        const { error } = await supabase.from('resorts').insert({
          name: formData.name,
          location: formData.location,
          image: formData.image,
          rating: formData.rating,
          price: formData.price,
          amenities: filteredAmenities,
          region_id: formData.region_id,
          description: formData.description,
          max_people: formData.max_people,
          has_beach_access: formData.has_beach_access,
          has_pool: formData.has_pool,
          is_featured: formData.is_featured
        })
        
        if (error) throw error
      } else if (showEditModal && currentResort) {
        // 기존 리조트 수정
        const { error } = await supabase.from('resorts')
          .update({
            name: formData.name,
            location: formData.location,
            image: formData.image,
            rating: formData.rating,
            price: formData.price,
            amenities: filteredAmenities,
            region_id: formData.region_id,
            description: formData.description,
            max_people: formData.max_people,
            has_beach_access: formData.has_beach_access,
            has_pool: formData.has_pool,
            is_featured: formData.is_featured
          })
          .eq('id', currentResort.id)
          
        if (error) throw error
      }
      
      // 성공 후 데이터 새로고침 및 모달 닫기
      await fetchResortsAndRegions()
      closeModal()
    } catch (error) {
      console.error('저장 실패:', error)
      setError(error instanceof Error ? error.message : '저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (confirm('정말로 이 리조트를 삭제하시겠습니까?')) {
      try {
        const supabase = createClient()
        const { error } = await supabase.from('resorts').delete().eq('id', id)
        
        if (error) throw error
        
        // 삭제 후 목록 새로고침
        await fetchResortsAndRegions()
      } catch (error) {
        console.error('삭제 실패:', error)
        alert('리조트 삭제에 실패했습니다. 다시 시도해주세요.')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">리조트 관리</h1>
        <button 
          onClick={openAddModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle className="mr-2" size={18} />
          새 리조트 추가
        </button>
      </div>
      
      {/* 검색 */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="리조트 검색..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      
      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-2 text-gray-600">리조트 정보를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {/* 리조트 목록 */}
          {filteredResorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResorts.map(resort => (
                <div key={resort.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {/* 리조트 이미지 */}
                  <div className="relative h-48">
                    {resort.image ? (
                      <Image 
                        src={resort.image} 
                        alt={resort.name} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <p className="text-gray-500">이미지 없음</p>
                      </div>
                    )}
                    
                    {/* 특색 배지 */}
                    {resort.is_featured && (
                      <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        추천
                      </span>
                    )}
                  </div>
                  
                  {/* 리조트 정보 */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{resort.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">
                          <Map size={14} className="inline mr-1" />
                          {resort.location}
                        </p>
                        <p className="text-gray-600 text-sm mb-2">
                          {resort.regions?.name || '지역 정보 없음'}
                        </p>
                      </div>
                      
                      <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                        <Star fill="#FFD700" stroke="#FFD700" size={16} className="mr-1" />
                        <span className="font-medium">{resort.rating}</span>
                      </div>
                    </div>
                    
                    {/* 가격 정보 */}
                    <p className="text-lg font-bold text-blue-600 mt-2 mb-3">
                      {resort.price}원 ~
                    </p>
                    
                    {/* 특징 아이콘 */}
                    <div className="flex items-center gap-3 mt-1 mb-3">
                      {resort.max_people && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Users size={16} className="mr-1" />
                          <span>최대 {resort.max_people}인</span>
                        </div>
                      )}
                      
                      {resort.has_pool && (
                        <div className="flex items-center text-gray-600 text-sm">
                          <Palmtree size={16} className="mr-1" />
                          <span>수영장</span>
                        </div>
                      )}
                    </div>
                    
                    {/* 작업 버튼 */}
                    <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(resort)}
                          className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} className="mr-1" />
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(resort.id)}
                          className="flex items-center text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} className="mr-1" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500">등록된 리조트가 없거나 검색 결과가 없습니다.</p>
              <button 
                onClick={openAddModal}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-flex items-center"
              >
                <PlusCircle className="mr-2" size={18} />
                새 리조트 추가
              </button>
            </div>
          )}
        </>
      )}
      
      {/* 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">새 리조트 추가</h2>
              
              <form onSubmit={handleSubmit}>
                {/* 에러 메시지 */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 리조트 이름 */}
                  <div>
                    <label className="block text-gray-700 mb-1">리조트 이름 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  {/* 위치 */}
                  <div>
                    <label className="block text-gray-700 mb-1">위치 *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  {/* 지역 선택 */}
                  <div>
                    <label className="block text-gray-700 mb-1">지역 *</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">지역을 선택하세요</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 가격 */}
                  <div>
                    <label className="block text-gray-700 mb-1">기본 가격 *</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="예: 150000"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  {/* 평점 */}
                  <div>
                    <label className="block text-gray-700 mb-1">평점 (1-5)</label>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  
                  {/* 최대 인원 */}
                  <div>
                    <label className="block text-gray-700 mb-1">최대 인원</label>
                    <input
                      type="number"
                      name="max_people"
                      min="1"
                      value={formData.max_people || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                
                {/* 이미지 업로드 */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">대표 이미지 *</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={imageUploading}
                    />
                    {imageUploading && <span className="ml-2">업로드 중...</span>}
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <Image
                        src={formData.image}
                        alt="미리보기"
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                {/* 설명 */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">설명</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                </div>
                
                {/* 편의시설 */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">편의시설</label>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => handleAmenityChange(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="편의시설"
                      />
                      <button
                        type="button"
                        onClick={() => removeAmenityField(index)}
                        className="px-3 bg-red-500 text-white rounded-r hover:bg-red-600"
                        disabled={formData.amenities.length <= 1}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAmenityField}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    + 편의시설 추가
                  </button>
                </div>
                
                {/* 추가 특징 */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_beach_access"
                      name="has_beach_access"
                      checked={formData.has_beach_access || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="has_beach_access" className="text-gray-700">비치 접근 가능</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_pool"
                      name="has_pool"
                      checked={formData.has_pool || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="has_pool" className="text-gray-700">수영장 있음</label>
                  </div>
                </div>
                
                {/* 추천 여부 */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="is_featured" className="text-gray-700">추천 리조트로 표시</label>
                  </div>
                </div>
                
                {/* 액션 버튼 */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    disabled={isSaving}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    disabled={isSaving || imageUploading}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-sm mr-2"></span>
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        저장
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* 수정 모달 */}
      {showEditModal && currentResort && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">리조트 정보 수정</h2>
              
              <form onSubmit={handleSubmit}>
                {/* 에러 메시지 */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* 리조트 이름 */}
                  <div>
                    <label className="block text-gray-700 mb-1">리조트 이름 *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  {/* 위치 */}
                  <div>
                    <label className="block text-gray-700 mb-1">위치 *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  {/* 지역 선택 */}
                  <div>
                    <label className="block text-gray-700 mb-1">지역 *</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    >
                      <option value="">지역을 선택하세요</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* 가격 */}
                  <div>
                    <label className="block text-gray-700 mb-1">기본 가격 *</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="예: 150000"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  
                  {/* 평점 */}
                  <div>
                    <label className="block text-gray-700 mb-1">평점 (1-5)</label>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  
                  {/* 최대 인원 */}
                  <div>
                    <label className="block text-gray-700 mb-1">최대 인원</label>
                    <input
                      type="number"
                      name="max_people"
                      min="1"
                      value={formData.max_people || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                
                {/* 이미지 업로드 */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">대표 이미지 *</label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      disabled={imageUploading}
                    />
                    {imageUploading && <span className="ml-2">업로드 중...</span>}
                  </div>
                  {formData.image && (
                    <div className="mt-2">
                      <Image
                        src={formData.image}
                        alt="미리보기"
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </div>
                
                {/* 설명 */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">설명</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  ></textarea>
                </div>
                
                {/* 편의시설 */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">편의시설</label>
                  {formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => handleAmenityChange(index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="편의시설"
                      />
                      <button
                        type="button"
                        onClick={() => removeAmenityField(index)}
                        className="px-3 bg-red-500 text-white rounded-r hover:bg-red-600"
                        disabled={formData.amenities.length <= 1}
                      >
                        -
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addAmenityField}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    + 편의시설 추가
                  </button>
                </div>
                
                {/* 추가 특징 */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit_has_beach_access"
                      name="has_beach_access"
                      checked={formData.has_beach_access || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="edit_has_beach_access" className="text-gray-700">비치 접근 가능</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit_has_pool"
                      name="has_pool"
                      checked={formData.has_pool || false}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="edit_has_pool" className="text-gray-700">수영장 있음</label>
                  </div>
                </div>
                
                {/* 추천 여부 */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="edit_is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <label htmlFor="edit_is_featured" className="text-gray-700">추천 리조트로 표시</label>
                  </div>
                </div>
                
                {/* 액션 버튼 */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                    disabled={isSaving}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    disabled={isSaving || imageUploading}
                  >
                    {isSaving ? (
                      <>
                        <span className="spinner-sm mr-2"></span>
                        저장 중...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        저장
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* 스타일 */}
      <style jsx>{`
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border-left-color: #09f;
          margin: 0 auto;
          animation: spin 1s linear infinite;
        }
        
        .spinner-sm {
          border: 2px solid rgba(255, 255, 255, 0.3);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border-left-color: white;
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
