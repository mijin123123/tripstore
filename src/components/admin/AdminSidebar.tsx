'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  Calendar, 
  Bell, 
  Settings, 
  Users, 
  LogOut, 
  BarChart3,
  Globe,
  ChevronRight,
  User
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  const navItems = [
    { name: '홈', href: '/admin', icon: Home },
    { name: '분석 대시보드', href: '/admin/dashboard', icon: BarChart3 },
    { name: '패키지 관리', href: '/admin/packages', icon: Package },
    { name: '예약 관리', href: '/admin/reservations', icon: Calendar },
    { name: '공지사항 관리', href: '/admin/notices', icon: Bell },
    { name: '관리자 설정', href: '/admin/settings/admins', icon: Users },
    { name: '내 프로필', href: '/admin/profile', icon: User },
  ];
  
  return (
    <div className={`bg-gradient-to-b from-slate-800 to-slate-900 text-white flex flex-col min-h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              T
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold">TripStore</h1>
                <p className="text-xs text-slate-400">관리자 패널</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <ChevronRight className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-slate-700 group ${
                    isActive ? 'bg-blue-600 shadow-lg' : ''
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'} ${
                    isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                  }`} />
                  {!collapsed && (
                    <span className={`font-medium ${
                      isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          <Link 
            href="/"
            className={`flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors text-slate-300 hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? '사이트로 이동' : undefined}
          >
            <Globe className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>사이트로 이동</span>}
          </Link>
          <Link 
            href="/login"
            className={`flex items-center p-3 rounded-lg hover:bg-red-600 transition-colors text-slate-300 hover:text-white ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? '로그아웃' : undefined}
          >
            <LogOut className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
            {!collapsed && <span>로그아웃</span>}
          </Link>
        </div>
      </div>
    </div>
  );
}
