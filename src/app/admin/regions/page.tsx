'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

interface Region {
  id: number
  name: string
  name_ko: string
  slug: string
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
    slug: ''
  })
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchRegions()
  }, [])

  const fetchRegions = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name')
      
      if (error) throw error
      setRegions(data || [])
    } catch (error) {
      console.error('지역 조회 실패:', error)
      setError('지역 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRegions = regions.filter(region =>
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.name_ko.includes(searchQuery) ||
    region.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const resetFormData = () => {
    setFormData({
      name: '',
      name_ko: '',
      slug: ''
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
      slug: region.slug
    })
    setShowEditModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveRegion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.name_ko || !formData.slug) {
      setError('필수 입력 필드를 모두 채워주세요.')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('regions')
        .insert([{
          name: formData.name,
          name_ko: formData.name_ko,
          slug: formData.slug
        }])
      
      if (error) throw error
      
      fetchRegions()
      setShowAddModal(false)
      resetFormData()
    } catch (error) {
      console.error('지역 추가 실패:', error)
      setError('지역 추가에 실패했습니다.')
    }
  }

  const handleUpdateRegion = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!formData.name || !formData.name_ko || !formData.slug) {
      setError('필수 입력 필드를 모두 채워주세요.')
      return
    }

    if (!currentRegion) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('regions')
        .update({
          name: formData.name,
          name_ko: formData.name_ko,
          slug: formData.slug
        })
        .eq('id', currentRegion.id)
      
      if (error) throw error
      
      fetchRegions()
      setShowEditModal(false)
      setCurrentRegion(null)
      resetFormData()
    } catch (error) {
      console.error('지역 수정 실패:', error)
      setError('지역 수정에 실패했습니다.')
    }
  }

  const handleDeleteRegion = async (id: number) => {
    if (!confirm('정말로 이 지역을 삭제하시겠습니까?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      fetchRegions()
    } catch (error) {
      console.error('지역 삭제 실패:', error)
      setError('지역 삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">로딩 중...</div>
    </div>
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">지역 관리</h1>
          <button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            지역 추가
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="지역명, 한글명 또는 슬러그로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">영문명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">한글명</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">슬러그</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegions.map((region) => (
                  <tr key={region.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{region.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.name_ko}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{region.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(region)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteRegion(region.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRegions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 지역이 없습니다.'}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">지역 추가</h2>
            
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
                
                <div className="md:col-span-2">
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

      {/* Edit Modal */}
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
                
                <div className="md:col-span-2">
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
                  수정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}