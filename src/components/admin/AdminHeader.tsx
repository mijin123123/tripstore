'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  
  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    }
  };
  
  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileElement = document.getElementById('profile-dropdown');
      const notifElement = document.getElementById('notification-dropdown');
      
      if (profileElement && !profileElement.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      
      if (notifElement && !notifElement.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // 알림 데이터 가져오기
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // 실제 구현 시 Supabase에서 알림 데이터 가져오기
        // 현재는 샘플 데이터로 표시
        setNotifications([
          { id: 1, title: '새 예약 알림', message: '새로운 예약이 등록되었습니다.', created_at: new Date().toISOString() },
          { id: 2, title: '취소된 예약', message: '예약이 취소되었습니다.', created_at: new Date().toISOString() }
        ]);
      } catch (error) {
        console.error('알림 가져오기 오류:', error);
      }
    };
    
    fetchNotifications();
  }, []);
  
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="검색..."
            className="w-72 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" id="notification-dropdown">
          <button 
            className="relative p-2 rounded-full hover:bg-gray-100"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-10">
              <div className="px-4 py-2 font-medium border-b">
                알림 ({notifications.length})
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-3 border-b hover:bg-gray-50">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-600">새로운 알림이 없습니다.</div>
                )}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-blue-600 hover:underline">
                  모든 알림 보기
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative" id="profile-dropdown">
          <button 
            className="flex items-center gap-2"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <span className="font-medium">{user?.email ? user.email.split('@')[0] : '관리자'}</span>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
              <a 
                href="/admin/profile" 
                className="flex items-center px-4 py-2 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4 mr-2" />
                프로필 설정
              </a>
              <button 
                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
