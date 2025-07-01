'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Calendar, Bell, Settings, Users, LogOut } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { name: '대시보드', href: '/admin/dashboard', icon: Home },
    { name: '패키지 관리', href: '/admin/packages', icon: Package },
    { name: '예약 관리', href: '/admin/reservations', icon: Calendar },
    { name: '공지사항 관리', href: '/admin/notices', icon: Bell },
    { name: '관리자 설정', href: '/admin/settings/admins', icon: Users },
    { name: '내 프로필', href: '/admin/profile', icon: Settings },
  ];
  
  return (
    <div className="bg-primary text-white w-64 flex flex-col min-h-screen p-4">
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-bold text-center">트립스토어 관리자</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  className={`flex items-center p-3 rounded-lg hover:bg-primary-dark transition-colors ${
                    isActive ? 'bg-primary-dark font-medium' : ''
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="border-t border-primary-dark pt-4 mt-8">
        <Link 
          href="/"
          className="flex items-center p-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Users className="w-5 h-5 mr-3" />
          <span>사이트로 이동</span>
        </Link>
        <Link 
          href="/login"
          className="flex items-center p-3 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>로그아웃</span>
        </Link>
      </div>
    </div>
  );
}
