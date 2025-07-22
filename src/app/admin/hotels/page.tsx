'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Search, Edit, Trash2, Star, Save } from 'lucide-react'

type Hotel = {
  id: string
  name: string
  location: string
  image: string
  rating: number
  price: string
  amenities: string[] | null
  category_id?: number
  description: string | null
  address: string | null
  is_featured: boolean
  room_types: string[] | null
  created_at: string
  updated_at: string
  categories?: {
    id: number
    name: string
  }
}

type Category = {
  id: number
  name: string
  slug: string
}

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null)
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
    category_id: 0,
    description: '',
    address: '',
    room_types: [''],
    is_featured: false
  })
  
  useEffect(() => {
    fetchHotelsAndRegions()
  }, [])
  
  const fetchHotelsAndRegions = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      // 호텔 데이터 가져오기
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('*, categories(id, name)')
        .order('created_at', { ascending: false })
      
      if (hotelError) throw hotelError
      
      // 호텔과 국내 카테고리만 가져오기
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .in('slug', ['hotel', 'domestic'])
        .order('name', { ascending: true })
      
      if (categoryError) throw categoryError
      
      // 데이터 변환 및 설정
      const formattedHotels: Hotel[] = (hotelData || []).map(hotel => ({
        ...hotel,
        category_id: hotel.category_id || 0
      }))
      
      setHotels(formattedHotels)
      setCategories((categoryData as Category[]) || [])
    } catch (error) {
      console.error('데이터를 가져오는 데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredHotels = hotels.filter(hotel => 
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (hotel.categories?.name && hotel.categories.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('hotels')
        .update({ is_featured: !currentStatus })
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 상태 업데이트
      setHotels(hotels.map(hotel => 
        hotel.id === id ? { ...hotel, is_featured: !currentStatus } : hotel
      ))
    } catch (error) {
      console.error('호텔 업데이트에 실패했습니다:', error)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('이 호텔을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      return
    }
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 목록에서 삭제된 호텔 제거
      setHotels(hotels.filter(hotel => hotel.id !== id))
    } catch (error) {
      console.error('호텔 삭제에 실패했습니다:', error)
    }
  }
  
  // 호텔 ID 자동 생성
  useEffect(() => {
    if (formData.name && showAddModal) {
      const generateId = () => {
        const prefix = 'HTL'
        const nameCode = formData.name.substring(0, 3).toUpperCase()
        const timestamp = Date.now().toString().substring(7)
        return `${prefix}-${nameCode}-${timestamp}`
      }
      
      setFormData(prev => ({ ...prev, id: generateId() }))
    }
  }, [formData.name, showAddModal])
  
  const resetFormData = () => {
    setFormData({
      id: '',
      name: '',
      location: '',
      image: '',
      rating: 4.5,
      price: '',
      amenities: [''],
      category_id: 0,
      description: '',
      address: '',
      room_types: [''],
      is_featured: false
    })
    setError('')
  }
  
  const handleOpenAddModal = () => {
    resetFormData()
    setShowAddModal(true)
  }
  
  const handleOpenEditModal = (hotel: Hotel) => {
    setCurrentHotel(hotel)
    setFormData({
      id: hotel.id,
      name: hotel.name,
      location: hotel.location,
      image: hotel.image,
      rating: hotel.rating,
      price: hotel.price,
      amenities: hotel.amenities || [''],
      category_id: hotel.category_id || 0,
      description: hotel.description || '',
      address: hotel.address || '',
      room_types: hotel.room_types || [''],
      is_featured: hotel.is_featured
    })
    setShowEditModal(true)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === 'rating' || name === 'category_id') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  // 편의 시설(amenities) 관리
  const handleAmenityChange = (index: number, value: string) => {
    const newAmenities = [...formData.amenities]
    newAmenities[index] = value
    setFormData(prev => ({ ...prev, amenities: newAmenities }))
  }
  
  const addAmenity = () => {
    setFormData(prev => ({ ...prev, amenities: [...prev.amenities, ''] }))
  }
  
  const removeAmenity = (index: number) => {
    const newAmenities = formData.amenities.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, amenities: newAmenities.length ? newAmenities : [''] }))
  }
  
  // 객실 타입(room_types) 관리
  const handleRoomTypeChange = (index: number, value: string) => {
    const newRoomTypes = [...formData.room_types]
    newRoomTypes[index] = value
    setFormData(prev => ({ ...prev, room_types: newRoomTypes }))
  }
  
  const addRoomType = () => {
    setFormData(prev => ({ ...prev, room_types: [...prev.room_types, ''] }))
  }
  
  const removeRoomType = (index: number) => {
    const newRoomTypes = formData.room_types.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, room_types: newRoomTypes.length ? newRoomTypes : [''] }))
  }
  
  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    setImageUploading(true)
    
    try {
      const supabase = createClient()
      
      // 파일 이름 생성 (고유값)
      const fileExt = file.name.split('.').pop()
      const fileName = `${formData.id || Date.now()}.${fileExt}`
      const filePath = `hotels/${fileName}`
      
      // 스토리지에 업로드
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      // 이미지 URL 가져오기
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)
      
      if (data) {
        setFormData(prev => ({ ...prev, image: data.publicUrl }))
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error)
      setError('이미지 업로드에 실패했습니다.')
    } finally {
      setImageUploading(false)
    }
  }
  
  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    
    // 필수 입력값 검증
    if (!formData.name || !formData.location || !formData.price || !formData.image) {
      setError('필수 입력 필드를 모두 채워주세요.')
      setIsSaving(false)
      return
    }
    
    // 빈 배열 항목 필터링
    const filteredAmenities = formData.amenities.filter(item => item.trim() !== '')
    const filteredRoomTypes = formData.room_types.filter(item => item.trim() !== '')
    
    try {
      const supabase = createClient()
      
      // 새 호텔 추가
      const { error } = await supabase
        .from('hotels')
        .insert({
          id: formData.id,
          name: formData.name,
          location: formData.location,
          image: formData.image,
          rating: formData.rating,
          price: formData.price,
          amenities: filteredAmenities,
          category_id: formData.category_id,
          description: formData.description || null,
          address: formData.address || null,
          room_types: filteredRoomTypes,
          is_featured: formData.is_featured
        })
      
      if (error) throw error
      
      // 성공 후 모달 닫고 목록 갱신
      setShowAddModal(false)
      fetchHotelsAndRegions()
    } catch (error: any) {
      console.error('호텔 저장 실패:', error)
      setError(`호텔 저장에 실패했습니다: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    
    if (!currentHotel) return
    
    // 필수 입력값 검증
    if (!formData.name || !formData.location || !formData.price || !formData.image) {
      setError('필수 입력 필드를 모두 채워주세요.')
      setIsSaving(false)
      return
    }
    
    // 빈 배열 항목 필터링
    const filteredAmenities = formData.amenities.filter(item => item.trim() !== '')
    const filteredRoomTypes = formData.room_types.filter(item => item.trim() !== '')
    
    try {
      const supabase = createClient()
      
      // 호텔 업데이트
      const { error } = await supabase
        .from('hotels')
        .update({
          name: formData.name,
          location: formData.location,
          image: formData.image,
          rating: formData.rating,
          price: formData.price,
          amenities: filteredAmenities,
          category_id: formData.category_id,
          description: formData.description || null,
          address: formData.address || null,
          room_types: filteredRoomTypes,
          is_featured: formData.is_featured
        })
        .eq('id', currentHotel.id)
      
      if (error) throw error
      
      // 성공 후 모달 닫고 목록 갱신
      setShowEditModal(false)
      fetchHotelsAndRegions()
    } catch (error: any) {
      console.error('호텔 업데이트 실패:', error)
      setError(`호텔 업데이트에 실패했습니다: ${error.message}`)
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
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">호텔 관리</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          <span>새 호텔 추가</span>
        </button>
      </div>
      
      {/* 검색 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="호텔명, 위치, ID로 검색..."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* 호텔 목록 */}
      {filteredHotels.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">이미지</th>
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">호텔명</th>
                  <th className="px-6 py-3 font-medium text-gray-500">위치</th>
                  <th className="px-6 py-3 font-medium text-gray-500">카테고리</th>
                  <th className="px-6 py-3 font-medium text-gray-500">가격</th>
                  <th className="px-6 py-3 font-medium text-gray-500">평점</th>
                  <th className="px-6 py-3 font-medium text-gray-500">객실 타입</th>
                  <th className="px-6 py-3 font-medium text-gray-500">추천</th>
                  <th className="px-6 py-3 font-medium text-gray-500">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      {hotel.image && (
                        <div className="h-12 w-16 relative overflow-hidden rounded-md">
                          <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 font-mono text-sm">{hotel.id}</td>
                    <td className="px-6 py-3 font-medium">{hotel.name}</td>
                    <td className="px-6 py-3">{hotel.location}</td>
                    <td className="px-6 py-3">{hotel.categories?.name || '알 수 없음'}</td>
                    <td className="px-6 py-3">{hotel.price}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                        <span>{hotel.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm">{hotel.room_types?.length || 0}개 타입</span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleToggleFeatured(hotel.id, hotel.is_featured)}
                        className={`w-12 h-6 flex items-center rounded-full transition-all duration-300 focus:outline-none shadow ${hotel.is_featured ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                      >
                        <span className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300`} />
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <button onClick={() => handleOpenEditModal(hotel)} className="text-gray-500 hover:text-blue-600">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(hotel.id)} className="text-gray-500 hover:text-red-600">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          {searchQuery ? (
            <>
              <p className="text-xl font-medium mb-2">검색 결과가 없습니다</p>
              <p className="text-gray-500">다른 검색어로 시도해보세요.</p>
            </>
          ) : (
            <>
              <p className="text-xl font-medium mb-2">등록된 호텔이 없습니다</p>
              <p className="text-gray-500 mb-4">새 호텔을 추가해 보세요.</p>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>새 호텔 추가</span>
              </button>
            </>
          )}
        </div>
      )}
      
      {/* 호텔 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">새 호텔 추가</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSaveHotel} className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="자동 생성됩니다"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">호텔명 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="호텔 이름"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="위치 (예: 서울 중구)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">지역 <span className="text-red-500">*</span></label>
                    <select
                      name="region_id"
                      value={formData.region_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">지역 선택</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name_ko} ({region.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가격 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 150,000원~"
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
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="상세 주소"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="호텔에 대한 설명"
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
                    <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">추천 호텔로 설정</label>
                  </div>
                </div>
              </div>
              
              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">이미지 <span className="text-red-500">*</span></h3>
                
                {formData.image ? (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.image}
                        alt="호텔 이미지"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">이미지를 업로드해주세요</p>
                  </div>
                )}
                
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <p className="mt-2 text-sm text-blue-500">이미지 업로드 중...</p>
                  )}
                </div>
              </div>
              
              {/* 편의 시설 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">편의 시설</h3>
                
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`편의 시설 ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addAmenity}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> 편의 시설 추가
                </button>
              </div>
              
              {/* 객실 타입 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">객실 타입</h3>
                
                {formData.room_types.map((roomType, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={roomType}
                      onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`객실 타입 ${index + 1} (예: 디럭스룸, 스위트룸)`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRoomType(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addRoomType}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> 객실 타입 추가
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center ${isSaving ? 'opacity-70' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      저장
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 호텔 수정 모달 */}
      {showEditModal && currentHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">호텔 수정: {currentHotel.name}</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpdateHotel} className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">호텔명 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="호텔 이름"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">위치 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="위치 (예: 서울 중구)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">지역 <span className="text-red-500">*</span></label>
                    <select
                      name="region_id"
                      value={formData.region_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">지역 선택</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name_ko} ({region.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가격 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 150,000원~"
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
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="상세 주소"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="호텔에 대한 설명"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_is_featured"
                      name="is_featured"
                      checked={formData.is_featured}
                      onChange={handleCheckboxChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="edit_is_featured" className="text-sm font-medium text-gray-700">추천 호텔로 설정</label>
                  </div>
                </div>
              </div>
              
              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">이미지 <span className="text-red-500">*</span></h3>
                
                {formData.image ? (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.image}
                        alt="호텔 이미지"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">이미지를 업로드해주세요</p>
                  </div>
                )}
                
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={imageUploading}
                  />
                  {imageUploading && (
                    <p className="mt-2 text-sm text-blue-500">이미지 업로드 중...</p>
                  )}
                </div>
              </div>
              
              {/* 편의 시설 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">편의 시설</h3>
                
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleAmenityChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`편의 시설 ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addAmenity}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> 편의 시설 추가
                </button>
              </div>
              
              {/* 객실 타입 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">객실 타입</h3>
                
                {formData.room_types.map((roomType, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={roomType}
                      onChange={(e) => handleRoomTypeChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`객실 타입 ${index + 1} (예: 디럭스룸, 스위트룸)`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRoomType(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addRoomType}
                  className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <PlusCircle className="h-4 w-4 mr-1" /> 객실 타입 추가
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={isSaving}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center ${isSaving ? 'opacity-70' : ''}`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      저장
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
