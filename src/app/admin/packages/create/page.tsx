'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

export default function CreatePackage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: 0,
    description: '',
    category: '',
    region: '',
    image: '',
    is_featured: false,
    start_date: '',
    end_date: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 })
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('packages')
        .insert([{
          name: formData.name,
          location: formData.location,
          price: formData.price,
          description: formData.description,
          category: formData.category,
          region: formData.region,
          image: formData.image,
          is_featured: formData.is_featured,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null
        }])
        .select()

      if (error) {
        throw error
      }

      router.push('/admin/packages')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/admin/packages"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            패키지 목록으로 돌아가기
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6">새 패키지 추가</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                패키지명 *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                위치 *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                가격 *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                
                <optgroup label="해외여행">
                  <option value="overseas-europe">해외여행 - 유럽</option>
                  <option value="overseas-japan">해외여행 - 일본</option>
                  <option value="overseas-southeast-asia">해외여행 - 동남아</option>
                  <option value="overseas-americas">해외여행 - 미주/캐나다/하와이</option>
                  <option value="overseas-china-hongkong">해외여행 - 대만/홍콩/마카오</option>
                  <option value="overseas-guam-saipan">해외여행 - 괌/사이판</option>
                </optgroup>
                
                <optgroup label="국내여행">
                  <option value="domestic-hotel">국내여행 - 호텔</option>
                  <option value="domestic-resort">국내여행 - 리조트</option>
                  <option value="domestic-pool-villa">국내여행 - 풀빌라</option>
                </optgroup>
                
                <optgroup label="호텔">
                  <option value="hotel-europe">호텔 - 유럽</option>
                  <option value="hotel-japan">호텔 - 일본</option>
                  <option value="hotel-southeast-asia">호텔 - 동남아</option>
                  <option value="hotel-americas">호텔 - 미주/캐나다/하와이</option>
                  <option value="hotel-china-hongkong">호텔 - 대만/홍콩/마카오</option>
                  <option value="hotel-guam-saipan">호텔 - 괌/사이판</option>
                </optgroup>
                
                <optgroup label="럭셔리">
                  <option value="luxury-europe">럭셔리 - 유럽</option>
                  <option value="luxury-japan">럭셔리 - 일본</option>
                  <option value="luxury-southeast-asia">럭셔리 - 동남아</option>
                  <option value="luxury-americas">럭셔리 - 미주/캐나다/하와이</option>
                  <option value="luxury-china-hongkong">럭셔리 - 대만/홍콩/마카오</option>
                  <option value="luxury-guam-saipan">럭셔리 - 괌/사이판</option>
                  <option value="luxury-cruise">럭셔리 - 크루즈</option>
                  <option value="luxury-special-theme">럭셔리 - 스페셜테마</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                지역
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                시작일
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                종료일
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
              추천 패키지로 설정
            </label>
          </div>

          <div className="flex justify-end gap-4">
            <Link
              href="/admin/packages"
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}