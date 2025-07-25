'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, Mail, Phone, Calendar, MapPin, Shield, ShieldOff, Ban, CheckCircle, Trash2 } from 'lucide-react'

type User = {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  is_blocked?: boolean | null
  created_at: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [bulkActionLoading, setBulkActionLoading] = useState(false)
  
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
        
        // is_blocked 필드가 없는 경우 기본값 false로 설정
        const usersWithBlockStatus = (data || []).map(user => {
          const { is_blocked = false, ...rest } = user as any
          return {
            ...rest,
            is_blocked
          }
        })
        
        setUsers(usersWithBlockStatus)
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
    
    setActionLoading(id)
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
        user.id === id ? { ...user, role: !currentStatus ? 'admin' : 'user' } : user
      ))
      
      alert(`관리자 권한이 ${!currentStatus ? '부여' : '해제'}되었습니다.`)
    } catch (error) {
      console.error('사용자 업데이트에 실패했습니다:', error)
      alert('권한 변경에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleBlock = async (id: string, currentStatus: boolean) => {
    if (!confirm(`이 사용자를 ${currentStatus ? '차단 해제' : '차단'}하시겠습니까?`)) {
      return
    }
    
    setActionLoading(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: !currentStatus } as any)
        .eq('id', id)
      
      if (error) {
        throw error
      }
      
      // 상태 업데이트
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_blocked: !currentStatus } : user
      ))
      
      alert(`사용자가 ${!currentStatus ? '차단' : '차단 해제'}되었습니다.`)
    } catch (error) {
      console.error('사용자 차단 상태 업데이트에 실패했습니다:', error)
      alert('차단 상태 변경에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setActionLoading(null)
    }
  }

  // 사용자 선택/해제
  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id))
    }
  }

  // 선택된 사용자 일괄 차단
  const handleBulkBlock = async () => {
    if (selectedUsers.length === 0) return

    if (!confirm(`선택된 ${selectedUsers.length}명의 사용자를 차단하시겠습니까?`)) {
      return
    }

    setBulkActionLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: true } as any)
        .in('id', selectedUsers)

      if (error) {
        throw error
      }

      // 상태 업데이트
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, is_blocked: true } 
          : user
      ))

      setSelectedUsers([])
      alert(`${selectedUsers.length}명의 사용자가 차단되었습니다.`)
    } catch (error) {
      console.error('일괄 차단에 실패했습니다:', error)
      alert('일괄 차단에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setBulkActionLoading(false)
    }
  }

  // 선택된 사용자 일괄 차단 해제
  const handleBulkUnblock = async () => {
    if (selectedUsers.length === 0) return

    if (!confirm(`선택된 ${selectedUsers.length}명의 사용자를 차단 해제하시겠습니까?`)) {
      return
    }

    setBulkActionLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('users')
        .update({ is_blocked: false } as any)
        .in('id', selectedUsers)

      if (error) {
        throw error
      }

      // 상태 업데이트
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, is_blocked: false } 
          : user
      ))

      setSelectedUsers([])
      alert(`${selectedUsers.length}명의 사용자가 차단 해제되었습니다.`)
    } catch (error) {
      console.error('일괄 차단 해제에 실패했습니다:', error)
      alert('일괄 차단 해제에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setBulkActionLoading(false)
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
        
        {/* 일괄 작업 버튼들 */}
        {selectedUsers.length > 0 && (
          <div className="flex space-x-2">
            <span className="text-sm text-gray-600 flex items-center">
              {selectedUsers.length}명 선택됨
            </span>
            <button
              onClick={handleBulkBlock}
              disabled={bulkActionLoading}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
            >
              {bulkActionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Ban className="h-4 w-4 mr-2" />
              )}
              일괄 차단
            </button>
            <button
              onClick={handleBulkUnblock}
              disabled={bulkActionLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
            >
              {bulkActionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              일괄 해제
            </button>
          </div>
        )}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        <div className="bg-white rounded-xl shadow p-4 flex flex-col">
          <span className="text-sm text-gray-500">차단된 사용자</span>
          <span className="text-2xl font-bold text-red-600">{users.filter(user => user.is_blocked).length}</span>
        </div>
      </div>
      
      {/* 사용자 목록 */}
      {filteredUsers.length > 0 ? (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm">
                  <th className="px-6 py-3 font-medium text-gray-500">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(u => u.id))
                        } else {
                          setSelectedUsers([])
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500">이름</th>
                  <th className="px-6 py-3 font-medium text-gray-500">이메일</th>
                  <th className="px-6 py-3 font-medium text-gray-500">전화번호</th>
                  <th className="px-6 py-3 font-medium text-gray-500">역할</th>
                  <th className="px-6 py-3 font-medium text-gray-500">상태</th>
                  <th className="px-6 py-3 font-medium text-gray-500">가입일</th>
                  <th className="px-6 py-3 font-medium text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.is_blocked ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id])
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-gray-600 mr-3 ${
                          user.is_blocked ? 'bg-red-200' : 'bg-gray-200'
                        }`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <span className={`font-medium ${user.is_blocked ? 'text-red-600' : ''}`}>
                          {user.name || '이름 없음'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span className={user.is_blocked ? 'text-red-600' : ''}>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.phone ? (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          <span className={user.is_blocked ? 'text-red-600' : ''}>{user.phone}</span>
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.is_blocked ? '차단됨' : '활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={user.is_blocked ? 'text-red-600' : ''}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleAdmin(user.id, user.role === 'admin')}
                          disabled={actionLoading === user.id || user.is_blocked}
                          className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                            user.role === 'admin' 
                              ? 'bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-red-25 disabled:text-red-400' 
                              : 'bg-green-50 text-green-700 hover:bg-green-100 disabled:bg-green-25 disabled:text-green-400'
                          } disabled:cursor-not-allowed`}
                        >
                          {actionLoading === user.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                          ) : user.role === 'admin' ? (
                            <ShieldOff className="h-4 w-4 mr-1" />
                          ) : (
                            <Shield className="h-4 w-4 mr-1" />
                          )}
                          {user.role === 'admin' ? '관리자 해제' : '관리자 지정'}
                        </button>
                        
                        <button
                          onClick={() => handleToggleBlock(user.id, user.is_blocked || false)}
                          disabled={actionLoading === user.id}
                          className={`flex items-center px-3 py-1 rounded text-sm transition-colors ${
                            user.is_blocked
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 disabled:bg-green-25 disabled:text-green-400'
                              : 'bg-red-50 text-red-700 hover:bg-red-100 disabled:bg-red-25 disabled:text-red-400'
                          } disabled:cursor-not-allowed`}
                        >
                          {actionLoading === user.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                          ) : user.is_blocked ? (
                            <CheckCircle className="h-4 w-4 mr-1" />
                          ) : (
                            <Ban className="h-4 w-4 mr-1" />
                          )}
                          {user.is_blocked ? '차단 해제' : '사용자 차단'}
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
            <p className="text-xl font-medium">등록된 사용자가 없습니다</p>
          )}
        </div>
      )}
    </div>
  )
}
