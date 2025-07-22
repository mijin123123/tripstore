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
  category_id: number
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
      // ?Έν…” ?°μ΄??κ°€?Έμ¤κΈ?
      const { data: hotelData, error: hotelError } = await supabase
        .from('hotels')
        .select('*, categories(id, name)')
        .order('created_at', { ascending: false })
      
      if (hotelError) throw hotelError
      
      // ?Έν…”κ³?κµ?‚΄ μΉ΄ν…κ³ λ¦¬λ§?κ°€?Έμ¤κΈ?
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .in('slug', ['hotel', 'domestic'])
        .order('name', { ascending: true })
      
      if (categoryError) throw categoryError
      
      // ?°μ΄???€?…μ„ ?ΌμΉ?ν‚¤κΈ??„ν•΄ λª…μ‹???€??λ³€??
      setHotels((hotelData as Hotel[]) || [])
      setCategories((categoryData as Category[]) || [])
    } catch (error) {
      console.error('?°μ΄?°λ? κ°€?Έμ¤?????¤ν¨?μµ?λ‹¤:', error)
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
      
      // ?νƒ ?…λ°?΄νΈ
      setHotels(hotels.map(hotel => 
        hotel.id === id ? { ...hotel, is_featured: !currentStatus } : hotel
      ))
    } catch (error) {
      console.error('?Έν…” ?…λ°?΄νΈ???¤ν¨?μµ?λ‹¤:', error)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('???Έν…”???? ?μ‹κ² μµ?κΉ? ???‘μ—…?€ μ·¨μ†?????†μµ?λ‹¤.')) {
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
      
      // λª©λ΅?μ„ ?? ???Έν…” ?κ±°
      setHotels(hotels.filter(hotel => hotel.id !== id))
    } catch (error) {
      console.error('?Έν…” ?? ???¤ν¨?μµ?λ‹¤:', error)
    }
  }
  
  // ?Έν…” ID ?λ™ ?μ„±
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
      category_id: hotel.category_id,
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
  
  // ?Έμ ?μ„¤(amenities) κ΄€λ¦?
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
  
  // κ°μ‹¤ ?€??room_types) κ΄€λ¦?
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
  
  // ?΄λ?μ§€ ?…λ΅??μ²λ¦¬
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    setImageUploading(true)
    
    try {
      const supabase = createClient()
      
      // ?μΌ ?΄λ¦„ ?μ„± (κ³ μ κ°?
      const fileExt = file.name.split('.').pop()
      const fileName = `${formData.id || Date.now()}.${fileExt}`
      const filePath = `hotels/${fileName}`
      
      // ?¤ν† λ¦¬μ????…λ΅??
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      // ?΄λ?μ§€ URL κ°€?Έμ¤κΈ?
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)
      
      if (data) {
        setFormData(prev => ({ ...prev, image: data.publicUrl }))
      }
    } catch (error) {
      console.error('?΄λ?μ§€ ?…λ΅???¤ν¨:', error)
      setError('?΄λ?μ§€ ?…λ΅?μ— ?¤ν¨?μµ?λ‹¤.')
    } finally {
      setImageUploading(false)
    }
  }
  
  const handleSaveHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    
    // ?„μ ?…λ ¥κ°?κ²€μ¦?
    if (!formData.name || !formData.location || !formData.price || !formData.image) {
      setError('?„μ ?…λ ¥ ?„λ“λ¥?λª¨λ‘ μ±„μ›μ£Όμ„Έ??')
      setIsSaving(false)
      return
    }
    
    // λΉ?λ°°μ—΄ ??ª© ?„ν„°λ§?
    const filteredAmenities = formData.amenities.filter(item => item.trim() !== '')
    const filteredRoomTypes = formData.room_types.filter(item => item.trim() !== '')
    
    try {
      const supabase = createClient()
      
      // ???Έν…” μ¶”κ?
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
      
      // ?±κ³µ ??λª¨λ‹¬ ?«κ³  λª©λ΅ κ°±μ‹ 
      setShowAddModal(false)
      fetchHotelsAndRegions()
    } catch (error: any) {
      console.error('?Έν…” ?€???¤ν¨:', error)
      setError(`?Έν…” ?€?¥μ— ?¤ν¨?μµ?λ‹¤: ${error.message}`)
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleUpdateHotel = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)
    
    if (!currentHotel) return
    
    // ?„μ ?…λ ¥κ°?κ²€μ¦?
    if (!formData.name || !formData.location || !formData.price || !formData.image) {
      setError('?„μ ?…λ ¥ ?„λ“λ¥?λª¨λ‘ μ±„μ›μ£Όμ„Έ??')
      setIsSaving(false)
      return
    }
    
    // λΉ?λ°°μ—΄ ??ª© ?„ν„°λ§?
    const filteredAmenities = formData.amenities.filter(item => item.trim() !== '')
    const filteredRoomTypes = formData.room_types.filter(item => item.trim() !== '')
    
    try {
      const supabase = createClient()
      
      // ?Έν…” ?…λ°?΄νΈ
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
      
      // ?±κ³µ ??λª¨λ‹¬ ?«κ³  λª©λ΅ κ°±μ‹ 
      setShowEditModal(false)
      fetchHotelsAndRegions()
    } catch (error: any) {
      console.error('?Έν…” ?…λ°?΄νΈ ?¤ν¨:', error)
      setError(`?Έν…” ?…λ°?΄νΈ???¤ν¨?μµ?λ‹¤: ${error.message}`)
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
        <h1 className="text-3xl font-bold">?Έν…” κ΄€λ¦?/h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          <span>???Έν…” μ¶”κ?</span>
        </button>
      </div>
      
      {/* κ²€??*/}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="?Έν…”λª? ?„μΉ, IDλ΅?κ²€??.."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* ?Έν…” λª©λ΅ */}
      {filteredHotels.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">?΄λ?μ§€</th>
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">?Έν…”λª?/th>
                  <th className="px-6 py-3 font-medium text-gray-500">?„μΉ</th>
                  <th className="px-6 py-3 font-medium text-gray-500">μΉ΄ν…κ³ λ¦¬</th>
                  <th className="px-6 py-3 font-medium text-gray-500">κ°€κ²?/th>
                  <th className="px-6 py-3 font-medium text-gray-500">?‰μ </th>
                  <th className="px-6 py-3 font-medium text-gray-500">κ°μ‹¤ ?€??/th>
                  <th className="px-6 py-3 font-medium text-gray-500">μ¶”μ²</th>
                  <th className="px-6 py-3 font-medium text-gray-500">?™μ‘</th>
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
                    <td className="px-6 py-3">{hotel.categories?.name || '?????†μ'}</td>
                    <td className="px-6 py-3">{hotel.price}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                        <span>{hotel.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm">{hotel.room_types?.length || 0}κ°??€??/span>
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
              <p className="text-xl font-medium mb-2">κ²€??κ²°κ³Όκ°€ ?†μµ?λ‹¤</p>
              <p className="text-gray-500">?¤λ¥Έ κ²€?‰μ–΄λ΅??λ„?΄λ³΄?Έμ”.</p>
            </>
          ) : (
            <>
              <p className="text-xl font-medium mb-2">?±λ΅???Έν…”???†μµ?λ‹¤</p>
              <p className="text-gray-500 mb-4">???Έν…”??μ¶”κ???λ³΄μ„Έ??</p>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>???Έν…” μ¶”κ?</span>
              </button>
            </>
          )}
        </div>
      )}
      
      {/* ?Έν…” μ¶”κ? λª¨λ‹¬ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">???Έν…” μ¶”κ?</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSaveHotel} className="space-y-6">
              {/* κΈ°λ³Έ ?•λ³΄ */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">κΈ°λ³Έ ?•λ³΄</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="?λ™ ?μ„±?©λ‹??
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">?Έν…”λª?<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="?Έν…” ?΄λ¦„"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">?„μΉ <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="?„μΉ (?? ?μΈ μ¤‘κµ¬)"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">μ§€??<span className="text-red-500">*</span></label>
                    <select
                      name="region_id"
                      value={formData.region_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">μ§€??? νƒ</option>
                      {regions.map(region => (
                        <option key={region.id} value={region.id}>
                          {region.name_ko} ({region.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">κ°€κ²?<span className="text-red-500">*</span></label>
                    <input
