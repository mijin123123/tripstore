'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, PlusCircle, Edit, Trash2, Map, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Region = {
  id: number
  name: string
  name_ko: string
  slug: string
  description: string | null
  image: string | null
  parent_id: number | null
  created_at: string
  updated_at: string
}

export default function AdminRegions() {
  const [regions, setRegions] = useState<Region[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    name_ko: '',
    slug: '',
    description: '',
    image: '',
    parent_id: null as number | null
  })
  const [imageUploading, setImageUploading] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchRegions()
  }, [])
  
  const fetchRegions = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('id', { ascending: true })
      
      if (error) {
        throw error
      }
      
      setRegions(data || [])
    } catch (error) {
      console.error('지역을 가져오는 데 실패했습니다:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const filteredRegions = regions.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.name_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const resetFormData = () => {
    setFormData({
      name: '',
      name_ko: '',
      slug: '',
      description: '',
      image: '',
      parent_id: null
    })
    setError('')
  }
  
  const handleOpenAddModal = () => {
    resetFormData()
    setShowAddModal(true)
  }
  
  const handleOpenEditModal = (region: Region) => {
    setCurrentRegion(region)
    setFormData({
      name: region.name,
      name_ko: region.name_ko,
      slug: region.slug,
      description: region.description || '',
      image: region.image || '',
      parent_id: region.parent_id
    })
    setShowEditModal(true)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'parent_id' ? (value ? parseInt(value) : null) : value 
    }))
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
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `regions/${fileName}`
      
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
  
  const handleSaveRegion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // 필수 입력값 검증
    if (!formData.name || !formData.name_ko || !formData.slug) {
      setError('필수 입력 필드를 모두 채워주세요.')
      return
    }
    
    try {
      const supabase = createClient()
      
      // 새 지역 추가
      const { error } = await supabase
        .from('regions')
        .insert({
          name: formData.name,
          name_ko: formData.name_ko,
          slug: formData.slug,
          description: formData.description || null,
          image: formData.image || null,
          parent_id: formData.parent_id
        })
      
      if (error) throw error
      
      // 성공 후 모달 닫고 목록 갱신
      setShowAddModal(false)
      fetchRegions()
    } catch (error: any) {
      console.error('지역 저장 실패:', error)
      setError(`지역 저장에 실패했습니다: ${error.message}`)
    }
  }
  
  const handleUpdateRegion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!currentRegion) return
    
    // 필수 입력값 검증
    if (!formData.name || !formData.name_ko || !formData.slug) {
      setError('필수 입력 필드를 모두 채워주세요.')
      return
    }
    
    try {
      const supabase = createClient()
      
      // 지역 업데이트
      const { error } = await supabase
        .from('regions')
        .update({
          name: formData.name,
          name_ko: formData.name_ko,
          slug: formData.slug,
          description: formData.description || null,
          image: formData.image || null,
          parent_id: formData.parent_id
        })
        .eq('id', currentRegion.id)
      
      if (error) throw error
      
      // 성공 후 모달 닫고 목록 갱신
      setShowEditModal(false)
      fetchRegions()
    } catch (error: any) {
      console.error('지역 업데이트 실패:', error)
      setError(`지역 업데이트에 실패했습니다: ${error.message}`)
    }
  }
  
  const handleDeleteRegion = async (id: number) => {
    if (!confirm('이 지역을 삭제하시겠습니까? 관련된 모든 패키지와 빌라가 영향을 받을 수 있습니다.')) {
      return
    }
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // 목록 갱신
      fetchRegions()
    } catch (error) {
      console.error('지역 삭제에 실패했습니다:', error)
      alert('지역 삭제에 실패했습니다. 이 지역을 참조하는 다른 항목이 있는지 확인하세요.')
    }
  }
  
  const getParentRegionName = (parentId: number | null) => {
    if (!parentId) return '없음'
    const parent = regions.find(r => r.id === parentId)
    return parent ? parent.name_ko : '알 수 없음'
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
        <h1 className="text-3xl font-bold">지역 관리</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          <span>새 지역 추가</span>
        </button>
      </div>
      
      {/* 검색 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="지역명, 슬러그로 검색..."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* 지역 목록 */}
      {filteredRegions.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">이미지</th>
                  <th className="px-6 py-3 font-medium text-gray-500">영문 이름</th>
                  <th className="px-6 py-3 font-medium text-gray-500">한글 이름</th>
                  <th className="px-6 py-3 font-medium text-gray-500">슬러그</th>
                  <th className="px-6 py-3 font-medium text-gray-500">상위 지역</th>
                  <th className="px-6 py-3 font-medium text-gray-500">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegions.map((region) => (
                  <tr key={region.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-sm">{region.id}</td>
                    <td className="px-6 py-3">
                      {region.image ? (
                        <div className="h-10 w-10 relative overflow-hidden rounded-md">
                          <Image 
                            src={region.image} 
                            alt={region.name_ko} 
                            fill 
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                          <Map className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 font-medium">{region.name}</td>
                    <td className="px-6 py-3">{region.name_ko}</td>
                    <td className="px-6 py-3 font-mono text-sm">{region.slug}</td>
                    <td className="px-6 py-3">{getParentRegionName(region.parent_id)}</td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleOpenEditModal(region)} 
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRegion(region.id)} 
                          className="text-gray-500 hover:text-red-600"
                        >
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
              <p className="text-xl font-medium mb-2">등록된 지역이 없습니다</p>
              <p className="text-gray-500 mb-4">새 지역을 추가해 보세요.</p>
              <button
                onClick={handleOpenAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>새 지역 추가</span>
              </button>
            </>
          )}
        </div>
      )}
      
      {/* 지역 추가 모달 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">새 지역 추가</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSaveRegion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">영문 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="영문 이름"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">한글 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name_ko"
                    value={formData.name_ko}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="한글 이름"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">슬러그 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="슬러그 (예: europe, asia)"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상위 지역</label>
                  <select
                    name="parent_id"
                    value={formData.parent_id?.toString() || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">없음 (최상위 지역)</option>
                    {regions.map(region => (
                      <option key={region.id} value={region.id.toString()}>
                        {region.name_ko} ({region.name})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="지역에 대한 설명"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
                  
                  {formData.image ? (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.image}
                          alt="지역 이미지"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : null}
                  
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
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 지역 수정 모달 */}
      {showEditModal && currentRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">지역 수정: {currentRegion.name_ko}</h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleUpdateRegion} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">영문 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="영문 이름"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">한글 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name_ko"
                    value={formData.name_ko}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="한글 이름"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">슬러그 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="슬러그 (예: europe, asia)"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상위 지역</label>
                  <select
                    name="parent_id"
                    value={formData.parent_id?.toString() || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">없음 (최상위 지역)</option>
                    {regions
                      .filter(region => region.id !== currentRegion.id) // 자기 자신은 부모가 될 수 없음
                      .map(region => (
                        <option key={region.id} value={region.id.toString()}>
                          {region.name_ko} ({region.name})
                        </option>
                      ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="지역에 대한 설명"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">이미지</label>
                  
                  {formData.image ? (
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                      <div className="relative h-40 w-full overflow-hidden rounded-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={formData.image}
                          alt="지역 이미지"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ) : null}
                  
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
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
