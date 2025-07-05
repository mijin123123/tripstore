'use client';

import { useState, useEffect } from 'react';
import { User, UserPlus, Check, X, Edit, Trash, Search, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase-admin';
import { useAuth } from '@/lib/auth';

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'admin',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  
  useEffect(() => {
    fetchAdmins();
    fetchCurrentUserRole();
  }, []);
  
  async function fetchCurrentUserRole() {
    if (!user?.email) return;
    
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('role')
        .eq('email', user.email)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setCurrentUserRole(data.role);
      }
    } catch (error) {
      console.error('현재 사용자 역할 불러오기 오류:', error);
    }
  }
  
  async function fetchAdmins() {
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      let adminList = data || [];
      
      // 기본 관리자가 없으면 추가 (하드코딩)
      const hasMainAdmin = adminList.some(admin => admin.email === 'sonchanmin89@gmail.com');
      
      if (!hasMainAdmin) {
        const defaultAdmin = {
          id: 'default-admin',
          email: 'sonchanmin89@gmail.com',
          name: '시스템 관리자',
          role: 'superadmin',
          permissions: { packages: true, reservations: true, notices: true, users: true, settings: true },
          is_active: true,
          created_at: new Date().toISOString(),
          last_login: null
        };
        adminList = [defaultAdmin, ...adminList];
      }
      
      // seonmjin039@gmail.com 제거 (있다면)
      adminList = adminList.filter(admin => admin.email !== 'seonmjin039@gmail.com');
      
      setAdmins(adminList);
    } catch (error: any) {
      // 오류가 발생해도 기본 관리자는 표시
      const defaultAdmin = {
        id: 'default-admin',
        email: 'sonchanmin89@gmail.com',
        name: '시스템 관리자',
        role: 'superadmin',
        permissions: { packages: true, reservations: true, notices: true, users: true, settings: true },
        is_active: true,
        created_at: new Date().toISOString(),
        last_login: null
      };
      setAdmins([defaultAdmin]);
      setError(`관리자 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!formData.email || !formData.name) {
      setError('모든 필수 필드를 입력해주세요.');
      return;
    }
    
    try {
      // 기본 권한 설정
      const permissions = formData.role === 'superadmin' 
        ? { packages: true, reservations: true, notices: true, users: true, settings: true }
        : { packages: true, reservations: true, notices: true, users: false, settings: false };
      
      if (editingId) {
        // 기존 관리자 업데이트
        const { error } = await supabase
          .from('admins')
          .update({
            name: formData.name,
            role: formData.role,
            permissions
          })
          .eq('id', editingId);
        
        if (error) throw error;
        
        setEditingId(null);
      } else {
        // 새 관리자 추가
        const { error } = await supabase
          .from('admins')
          .insert({
            email: formData.email,
            name: formData.name,
            role: formData.role,
            is_active: true,
            permissions
          });
        
        if (error) throw error;
      }
      
      // 폼 초기화 및 관리자 목록 새로고침
      setFormData({ email: '', name: '', role: 'admin' });
      setShowAddForm(false);
      fetchAdmins();
    } catch (error: any) {
      setError(`관리자 ${editingId ? '수정' : '추가'} 중 오류가 발생했습니다: ${error.message}`);
    }
  }
  
  function startEdit(admin: any) {
    setFormData({
      email: admin.email,
      name: admin.name || '',
      role: admin.role || 'admin'
    });
    setEditingId(admin.id);
    setShowAddForm(true);
  }
  
  async function toggleActiveStatus(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ is_active: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      
      fetchAdmins();
    } catch (error: any) {
      setError(`관리자 상태 변경 중 오류가 발생했습니다: ${error.message}`);
    }
  }
  
  // 슈퍼 관리자만 다른 관리자를 관리할 수 있음
  const canManageAdmins = currentUserRole === 'superadmin';
  
  // 검색 필터링된 관리자 목록
  const filteredAdmins = admins.filter(admin => 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (admin.name && admin.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (admin.role && admin.role.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">관리자 계정 관리</h1>
        
        {canManageAdmins && (
          <button
            onClick={() => {
              setFormData({ email: '', name: '', role: 'admin' });
              setEditingId(null);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="h-4 w-4" />
            {showAddForm ? '취소' : '관리자 추가'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? '관리자 정보 수정' : '새 관리자 추가'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="email">
                    이메일 *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!!editingId}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      editingId ? 'bg-gray-100' : ''
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="name">
                    이름 *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="role">
                    역할 *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="admin">일반 관리자</option>
                    <option value="manager">중간 관리자</option>
                    <option value="superadmin">슈퍼 관리자</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  <Check className="h-4 w-4" />
                  {editingId ? '저장' : '추가'}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="관리자 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>관리자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">관리자 목록을 불러오는 중...</div>
          ) : filteredAdmins.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">이름</th>
                    <th className="px-4 py-3 text-left">이메일</th>
                    <th className="px-4 py-3 text-left">역할</th>
                    <th className="px-4 py-3 text-left">상태</th>
                    <th className="px-4 py-3 text-left">마지막 로그인</th>
                    {canManageAdmins && (
                      <th className="px-4 py-3 text-right">관리</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          {admin.name || '(이름 없음)'}
                          {admin.email === user?.email && (
                            <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              나
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{admin.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Shield className={`w-4 h-4 ${
                            admin.role === 'superadmin' ? 'text-red-500' : 
                            admin.role === 'manager' ? 'text-amber-500' : 'text-blue-500'
                          }`} />
                          <span className={
                            admin.role === 'superadmin' ? 'text-red-600' : 
                            admin.role === 'manager' ? 'text-amber-600' : 'text-blue-600'
                          }>
                            {admin.role === 'superadmin' ? '슈퍼 관리자' : 
                             admin.role === 'manager' ? '중간 관리자' : '일반 관리자'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          admin.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.is_active ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {admin.last_login ? new Date(admin.last_login).toLocaleString('ko-KR') : '기록 없음'}
                      </td>
                      {canManageAdmins && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(admin)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              aria-label="수정"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => toggleActiveStatus(admin.id, admin.is_active)}
                              className="p-1 rounded-full hover:bg-gray-100"
                              aria-label={admin.is_active ? '비활성화' : '활성화'}
                              disabled={admin.email === user?.email}
                            >
                              {admin.is_active ? (
                                <X className="w-4 h-4 text-red-600" />
                              ) : (
                                <Check className="w-4 h-4 text-green-600" />
                              )}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              {searchQuery ? '검색 결과가 없습니다.' : '등록된 관리자가 없습니다.'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
