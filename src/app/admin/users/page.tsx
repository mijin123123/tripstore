'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Mail, Phone, Calendar, MapPin, Shield, ShieldOff } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) {
          throw error
        }
        
        setUsers(data || [])
      } catch (error) {
        console.error('사용자를 가져오는 데 실패했습니다:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsers()
  }, [])
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  const handleToggleAdmin = async (id: string, currentStatus: boolean) => {
    if (!confirm(`이 사용자의 관리자 권한을 ${currentStatus ? '해제' : '부여'}하시겠습니까?`)) {
      return
    }
    
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ role: !currentStatus ? 'admin' : 'user' })
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 상태 업데이트
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_admin: !currentStatus } : user
      ))
    } catch (error) {
      console.error('사용자 업데이트에 실패했습니다:', error)
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
        <h1 className="text-3xl font-bold">사용자 관리</h1>
      </div>
      
      {/* 검색 */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="이름, 이메일, 전화번호로 검색..."
            className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* 사용자 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <span className="text-sm text-gray-500">총 사용자</span>
          <span className="text-2xl font-bold">{users.length}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <span className="text-sm text-gray-500">관리자</span>
          <span className="text-2xl font-bold">{users.filter(user => user.role === 'admin').length}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <span className="text-sm text-gray-500">일반 사용자</span>
          <span className="text-2xl font-bold">{users.filter(user => user.role !== 'admin').length}</span>
        </div>
      </div>
      
      {/* 사용자 목록 */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">이름</th>
                  <th className="px-6 py-3 font-medium text-gray-500">이메일</th>
                  <th className="px-6 py-3 font-medium text-gray-500">전화번호</th>
                  <th className="px-6 py-3 font-medium text-gray-500">역할</th>
                  <th className="px-6 py-3 font-medium text-gray-500">가입일</th>
                  <th className="px-6 py-3 font-medium text-gray-500">권한 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className="font-medium">{user.name || '이름 없음'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'admin' ? '관리자' : '일반 사용자'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.role === 'admin')}
                        className={`flex items-center px-3 py-1 rounded text-sm ${
                          user.role === 'admin' 
                            ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {user.role === 'admin' ? (
                          <>
                            <ShieldOff className="h-4 w-4 mr-1" /> 관리자 해제
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-1" /> 관리자 지정
                          </>
                        )}
                      </button>
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
            <p className="text-xl font-medium">등록된 사용자가 없습니다</p>
          )}
        </div>
      )}
    </div>
  )
}
