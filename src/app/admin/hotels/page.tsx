'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Search, Edit, Trash2, Star, Save } from 'lucide-react'

// 실제 스키마에 맞는 Hotel 타입 정의
type Hotel = {
  id: string
  name: string
  location: string
  image: string
  rating: number
  price: string
  amenities: string[] | null
  category_id: number | null
  description: string | null
  address: string | null
  is_featured: boolean
  room_types: string[] | null
  created_at: string
  updated_at: string
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
    fetchHotelsAndCategories()
  }, [])
  
  const fetchHotelsAndCategories = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      // 호텔 데이터 가져오기
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (hotelError) throw hotelError
      
      // 카테고리 데이터 가져오기
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .in('slug', ['hotel', 'domestic'])
        .order('name', { ascending: true })
      
      if (categoryError) throw categoryError
      
      // 데이터 변환 및 설정
      const formattedHotels: Hotel[] = (hotelData || []).map(hotel => {
        // region_id를 category_id로 매핑 (데이터베이스 스키마 불일치 해결)
        return {
          id: hotel.id,
          name: hotel.name,
          location: hotel.location,
          image: hotel.image,
          rating: hotel.rating,
          price: hotel.price,
          amenities: hotel.amenities,
          category_id: (hotel as any).region_id || (hotel as any).category_id || null,
          description: hotel.description,
          address: hotel.address,
          is_featured: hotel.is_featured,
          room_types: hotel.room_types,
          created_at: hotel.created_at,
          updated_at: hotel.updated_at
        }
      })
      
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
    hotel.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('hotels')
        .update({ is_featured: !currentStatus })
        .eq('id', id)
      
      if (error) throw error
      
      setHotels(hotels.map(hotel => 
        hotel.id === id ? { ...hotel, is_featured: !currentStatus } : hotel
      ))
    } catch (error) {
      console.error('추천 상태 변경에 실패했습니다:', error)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 호텔을 삭제하시겠습니까?')) return
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('hotels')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setHotels(hotels.filter(hotel => hotel.id !== id))
    } catch (error) {
      console.error('호텔 삭제에 실패했습니다:', error)
    }
  }
  
  const resetForm = () => {
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
    setCurrentHotel(null)
  }
  
  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }
  
  const openEditModal = (hotel: Hotel) => {
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
    setError('')
    setShowEditModal(true)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (name === 'category_id') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else if (name === 'rating') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }
  
  const handleArrayChange = (index: number, value: string, field: 'amenities' | 'room_types') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }
  
  const addArrayItem = (field: 'amenities' | 'room_types') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }
  
  const removeArrayItem = (index: number, field: 'amenities' | 'room_types') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }
  
  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    
    try {
      const filteredAmenities = formData.amenities.filter(a => a.trim() !== '')
      const filteredRoomTypes = formData.room_types.filter(r => r.trim() !== '')
      
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
          region_id: formData.category_id, // category_id를 region_id로 매핑
          description: formData.description || null,
          address: formData.address || null,
          room_types: filteredRoomTypes,
          is_featured: formData.is_featured
        })
      
      if (error) throw error
      
      // 성공 후 모달 닫고 목록 갱신
      setShowAddModal(false)
      fetchHotelsAndCategories()
    } catch (error: any) {
      console.error('호텔 추가 중 오류:', error)
      setError(error.message || '호텔 추가에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">호텔 관리</h1>
            <p className="text-gray-600">호텔 정보를 관리하고 편집하세요</p>
          </div>
          
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>새 호텔 추가</span>
          </button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="호텔 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">호텔명</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">위치</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">카테고리</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평점</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">추천</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHotels.map((hotel) => (
                <tr key={hotel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="relative w-20 h-20">
                      <Image
                        src={hotel.image}
                        alt={hotel.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="80px"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 font-mono text-sm">{hotel.id}</td>
                  <td className="px-6 py-3 font-medium">{hotel.name}</td>
                  <td className="px-6 py-3">{hotel.location}</td>
                  <td className="px-6 py-3">{categories.find(cat => cat.id === hotel.category_id)?.name || '알 수 없음'}</td>
                  <td className="px-6 py-3">{hotel.price}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                      <span>{hotel.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleFeatured(hotel.id, hotel.is_featured)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        hotel.is_featured
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {hotel.is_featured ? '추천' : '일반'}
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(hotel)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
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

            <form onSubmit={handleAddHotel} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">호텔 ID <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="고유 ID (예: hotel-001)"
                    required
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
                        {category.name}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">평점 <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                  required
                />
              </div>
              
              <div>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="호텔 설명..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">편의시설</label>
                {formData.amenities.map((amenity, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={amenity}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'amenities')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="편의시설"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'amenities')}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      disabled={formData.amenities.length === 1}
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('amenities')}
                  className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  편의시설 추가
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">객실 유형</label>
                {formData.room_types.map((roomType, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={roomType}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'room_types')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="객실 유형"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'room_types')}
                      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      disabled={formData.room_types.length === 1}
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('room_types')}
                  className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  객실 유형 추가
                </button>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">추천 호텔로 설정</label>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '호텔 추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
