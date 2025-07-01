'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase-admin';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [adminData, setAdminData] = useState<any>(null);
  
  useEffect(() => {
    // 사용자 정보가 있으면 기본값 설정
    if (user) {
      setEmail(user.email || '');
      
      // 관리자 정보 불러오기
      const fetchAdminData = async () => {
        try {
          const { data, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', user.email)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setAdminData(data);
            setName(data.name || '');
          }
        } catch (error) {
          console.error('관리자 정보 로드 오류:', error);
        }
      };
      
      fetchAdminData();
    }
  }, [user]);
  
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage({ type: 'error', text: '로그인 정보를 찾을 수 없습니다.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // 관리자 정보 업데이트
      if (adminData) {
        const { error } = await supabase
          .from('admins')
          .update({ name })
          .eq('id', adminData.id);
          
        if (error) throw error;
      }
      
      // 비밀번호 변경이 요청된 경우
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setMessage({ type: 'error', text: '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.' });
          setLoading(false);
          return;
        }
        
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) throw error;
        
        // 비밀번호 입력 필드 초기화
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
      
      setMessage({ type: 'success', text: '프로필이 성공적으로 업데이트되었습니다.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: `프로필 업데이트 오류: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">프로필 설정</h1>
      
      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>개인 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  이름
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '저장 중...' : (
                  <>
                    <Save className="h-4 w-4" />
                    변경사항 저장
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="current-password">
                  현재 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="new-password">
                  새 비밀번호
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '저장 중...' : (
                  <>
                    <Save className="h-4 w-4" />
                    비밀번호 변경
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>계정 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">관리자 역할</span>
              <span className="font-medium">{adminData?.role || '-'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">계정 상태</span>
              <span className={`font-medium ${adminData?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {adminData?.is_active ? '활성화' : '비활성화'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">마지막 로그인</span>
              <span className="font-medium">
                {adminData?.last_login ? new Date(adminData.last_login).toLocaleString('ko-KR') : '기록 없음'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">등록일</span>
              <span className="font-medium">
                {adminData?.created_at ? new Date(adminData.created_at).toLocaleString('ko-KR') : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
