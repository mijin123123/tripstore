import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>
        <p className="text-gray-600 mb-8">
          환영합니다! 왼쪽 메뉴에서 관리 항목을 선택하거나 아래 링크를 통해 관리 페이지로 이동하세요.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">대시보드</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link 
            href="/admin/packages" 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">패키지 관리</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link 
            href="/admin/reservations" 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">예약 관리</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
          
          <Link 
            href="/admin/notices" 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium">공지사항 관리</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
