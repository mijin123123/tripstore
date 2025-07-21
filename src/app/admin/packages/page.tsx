'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Search, Edit, Trash2, Star, Eye } from 'lucide-react'

type Package = {
  id: string
  title: string
  region: string
  region_ko: string
  price: string
  duration: string
  rating: number
  image: string
  is_featured: boolean
  type: string
}

export default function AdminPackages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        setPackages(data || [])
      } catch (error) {
        console.error('패키지를 가져오는 데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPackages()
  }, [])
  
  const filteredPackages = packages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.region_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.id.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('packages')
        .update({ is_featured: !currentStatus })
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 상태 업데이트
      setPackages(packages.map(pkg => 
        pkg.id === id ? { ...pkg, is_featured: !currentStatus } : pkg
      ))
    } catch (error) {
      console.error('패키지 업데이트에 실패했습니다:', error)
    }
  }
  
  const handleDelete = async (id: string) => {
    if (!confirm('이 패키지를 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.')) {
      return
    }
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 목록에서 삭제된 패키지 제거
      setPackages(packages.filter(pkg => pkg.id !== id))
    } catch (error) {
      console.error('패키지 삭제에 실패했습니다:', error)
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">패키지 관리</h1>
        <Link href="/admin/packages/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <PlusCircle className="h-5 w-5 mr-2" />
          <span>새 패키지 추가</span>
        </Link>
      </div>
      
      {/* 검색 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="제목, 지역, ID로 검색..."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* 패키지 목록 */}
      {filteredPackages.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">이미지</th>
                  <th className="px-6 py-3 font-medium text-gray-500">ID</th>
                  <th className="px-6 py-3 font-medium text-gray-500">제목</th>
                  <th className="px-6 py-3 font-medium text-gray-500">지역</th>
                  <th className="px-6 py-3 font-medium text-gray-500">가격</th>
                  <th className="px-6 py-3 font-medium text-gray-500">기간</th>
                  <th className="px-6 py-3 font-medium text-gray-500">평점</th>
                  <th className="px-6 py-3 font-medium text-gray-500">타입</th>
                  <th className="px-6 py-3 font-medium text-gray-500">추천</th>
                  <th className="px-6 py-3 font-medium text-gray-500">동작</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      {pkg.image && (
                        <div className="h-12 w-16 relative overflow-hidden rounded-md">
                          <Image
                            src={pkg.image}
                            alt={pkg.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-3 font-mono text-sm">{pkg.id}</td>
                    <td className="px-6 py-3 font-medium">{pkg.title}</td>
                    <td className="px-6 py-3">{pkg.region_ko}</td>
                    <td className="px-6 py-3">{pkg.price}</td>
                    <td className="px-6 py-3">{pkg.duration}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                        <span>{pkg.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {pkg.type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleToggleFeatured(pkg.id, pkg.is_featured)}
                        className={`w-12 h-6 flex items-center rounded-full transition-all duration-300 focus:outline-none shadow ${pkg.is_featured ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}
                      >
                        <span className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300`} />
                      </button>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex space-x-2">
                        <Link href={`/package/${pkg.id}`} className="text-gray-500 hover:text-blue-600" target="_blank">
                          <Eye className="h-5 w-5" />
                        </Link>
                        <Link href={`/admin/packages/edit/${pkg.id}`} className="text-gray-500 hover:text-blue-600">
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button onClick={() => handleDelete(pkg.id)} className="text-gray-500 hover:text-red-600">
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
              <p className="text-xl font-medium mb-2">등록된 패키지가 없습니다</p>
              <p className="text-gray-500 mb-4">새 패키지를 추가해 보세요.</p>
              <Link href="/admin/packages/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors">
                <PlusCircle className="h-5 w-5 mr-2" />
                <span>새 패키지 추가</span>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
