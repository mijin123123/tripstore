'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, Settings, Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  
  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      console.log('로그아웃 시작...');
      await logout();
      // 로그아웃은 auth.tsx에서 페이지 리다이렉션을 처리합니다
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      alert('로그아웃 처리 중 오류가 발생했습니다.');
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
        // 실제 구현 시 API에서 알림 데이터 가져오기
        setNotifications([
          { 
            id: 1, 
            title: '새 예약 알림', 
            message: '홍길동님이 제주도 패키지를 예약했습니다.', 
            created_at: new Date().toISOString(),
            type: 'reservation' 
          },
          { 
            id: 2, 
            title: '취소된 예약', 
            message: '부산 여행 패키지 예약이 취소되었습니다.', 
            created_at: new Date(Date.now() - 3600000).toISOString(),
            type: 'cancellation' 
          },
          { 
            id: 3, 
            title: '새 문의', 
            message: '패키지 문의가 등록되었습니다.', 
            created_at: new Date(Date.now() - 7200000).toISOString(),
            type: 'inquiry' 
          }
        ]);
      } catch (error) {
        console.error('알림 가져오기 오류:', error);
      }
    };
    
    fetchNotifications();
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return '📅';
      case 'cancellation':
        return '❌';
      case 'inquiry':
        return '💬';
      default:
        return '📢';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}시간 전`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}일 전`;
    }
  };
  
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6 flex-1">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-gray-600" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        {/* Notifications */}
        <div className="relative" id="notification-dropdown">
          <button 
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>
          
          {notificationOpen && (
            <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-10">
              <div className="px-4 py-3 font-semibold border-b border-gray-100 flex items-center justify-between">
                <span>알림</span>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {notifications.length}개
                </span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {getTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">새로운 알림이 없습니다.</p>
                  </div>
                )}
              </div>
              <div className="px-4 py-3 text-center border-t border-gray-100">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  모든 알림 보기
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative" id="profile-dropdown">
          <button 
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
              {user?.email ? user.email[0].toUpperCase() : 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-medium text-gray-900 text-sm">
                {user?.email ? user.email.split('@')[0] : '관리자'}
              </p>
              <p className="text-xs text-gray-500">관리자</p>
            </div>
          </button>
          
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-medium text-gray-900">
                  {user?.email ? user.email.split('@')[0] : '관리자'}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user?.email || 'admin@tripstore.com'}</p>
              </div>
              
              <div className="py-1">
                <a 
                  href="/admin/profile" 
                  className="flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 mr-3 text-gray-500" />
                  <span className="text-sm text-gray-700">프로필 설정</span>
                </a>
                <button 
                  className="flex items-center w-full text-left px-4 py-2.5 hover:bg-red-50 transition-colors text-red-600"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <span className="text-sm">로그아웃</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
