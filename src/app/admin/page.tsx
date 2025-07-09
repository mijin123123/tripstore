'use client';

import AdminProtection from '@/components/AdminProtection';
import AdminLogout from '@/components/AdminLogout';
import { 
  ChevronRight, 
  Package, 
  Calendar, 
  Bell, 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalPackages: number;
  totalReservations: number;
  totalNotices: number;
  recentReservations: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    totalReservations: 0,
    totalNotices: 0,
    recentReservations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch statistics from APIs
        const [packagesRes, reservationsRes, noticesRes] = await Promise.all([
          fetch('/api/packages'),
          fetch('/api/reservations'),
          fetch('/api/notices')
        ]);

        const packages = await packagesRes.json();
        const reservations = await reservationsRes.json();
        const notices = await noticesRes.json();

        // Calculate recent reservations (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentReservations = reservations.filter((r: any) => 
          new Date(r.created_at) > oneWeekAgo
        ).length;

        setStats({
          totalPackages: packages.length || 0,
          totalReservations: reservations.length || 0,
          totalNotices: notices.length || 0,
          recentReservations
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: '패키지 관리',
      description: '여행 패키지 생성 및 관리',
      href: '/admin/packages',
      icon: Package,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: '예약 관리',
      description: '고객 예약 현황 및 관리',
      href: '/admin/reservations',
      icon: Calendar,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: '공지사항 관리',
      description: '공지사항 작성 및 관리',
      href: '/admin/notices',
      icon: Bell,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: '대시보드',
      description: '상세 분석 및 통계',
      href: '/admin/dashboard',
      icon: BarChart3,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    }
  ];

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">관리자 대시보드</h1>
              <p className="text-gray-600">TripStore 관리 시스템에 오신 것을 환영합니다</p>
            </div>
            <AdminLogout />
          </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 패키지</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalPackages}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 예약</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalReservations}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">공지사항</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalNotices}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">최근 예약</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.recentReservations}
                </p>
                <p className="text-xs text-gray-500">지난 7일</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              최근 활동
            </h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">새로운 예약이 등록되었습니다</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">패키지가 업데이트되었습니다</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-sm text-gray-700">공지사항이 발행되었습니다</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              시스템 상태
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">서버 상태</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">정상</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">데이터베이스</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">연결됨</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">API 서비스</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">활성</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AdminProtection>
  );
}
