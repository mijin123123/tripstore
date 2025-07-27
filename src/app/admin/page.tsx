'use client'

import React, { useEffect, useState } from 'react'
import { Users, Package, Calendar, DollarSign, TrendingUp, Eye } from 'lucide-react'
import Link from 'next/link'
// @ts-ignore - 빌드 중 경로 문제 무시
import { useAuth } from '@/components/AuthProvider'
// @ts-ignore - 빌드 중 경로 문제 무시
import { createClient } from '@/lib/supabase-client'

interface DashboardStats {
  totalUsers: number
  totalPackages: number
  totalBookings: number
  totalRevenue: number
  featuredPackages: number
  recentBookings: number
}

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPackages: 0,
    totalBookings: 0,
    totalRevenue: 0,
    featuredPackages: 0,
    recentBookings: 0
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    if (isAdmin && !loading) {
      fetchDashboardStats()
    }
  }, [isAdmin, loading])

  const fetchDashboardStats = async () => {
    try {
      const supabase = createClient()
      
      // 총 사용자 수
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      // 총 패키지 수
      const { count: packagesCount } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
      
      // 추천 패키지 수
      const { count: featuredCount } = await supabase
        .from('packages')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true)
      
      // 총 예약 수
      const { count: bookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
      
      // 최근 7일 예약 수
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: recentBookingsCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
      
      // 총 수익 계산 (예약된 패키지들의 가격 합계)
      const { data: bookingRevenue } = await supabase
        .from('bookings')
        .select(`
          packages (
            price
          )
        `)
        .eq('status', 'confirmed')
      
      const totalRevenue = bookingRevenue?.reduce((sum, booking: any) => {
        return sum + (booking.packages?.price || 0)
      }, 0) || 0

      setStats({
        totalUsers: usersCount || 0,
        totalPackages: packagesCount || 0,
        totalBookings: bookingsCount || 0,
        totalRevenue,
        featuredPackages: featuredCount || 0,
        recentBookings: recentBookingsCount || 0
      })
    } catch (error) {
      console.error('대시보드 통계 로딩 실패:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600 mb-4">관리자 권한이 필요합니다.</p>
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="mt-2 text-gray-600">트립스토어 관리 시스템에 오신 것을 환영합니다.</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 사용자</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.totalUsers.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 패키지</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.totalPackages.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 예약</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.totalBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 수익</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : `${stats.totalRevenue.toLocaleString()}원`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-indigo-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">추천 패키지</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.featuredPackages.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Eye className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">최근 7일 예약</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoadingStats ? '...' : stats.recentBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 관리 메뉴 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">관리 메뉴</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/admin/packages"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Package className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">패키지 관리</p>
                <p className="text-sm text-gray-500">여행 패키지 추가/수정/삭제</p>
              </div>
            </Link>

            <Link
              href="/admin/bookings"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-6 w-6 text-green-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">예약 관리</p>
                <p className="text-sm text-gray-500">예약 현황 및 관리</p>
              </div>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <Users className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">사용자 관리</p>
                <p className="text-sm text-gray-500">회원 정보 및 권한 관리</p>
              </div>
            </Link>

            <Link
              href="/admin/hero-images"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Eye className="h-6 w-6 text-purple-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">히어로 이미지</p>
                <p className="text-sm text-gray-500">메인 배너 이미지 관리</p>
              </div>
            </Link>

            <Link
              href="/admin/site-settings"
              className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <TrendingUp className="h-6 w-6 text-indigo-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">사이트 설정</p>
                <p className="text-sm text-gray-500">기본 설정 및 환경설정</p>
              </div>
            </Link>

            <Link
              href="/admin/debug"
              className="flex items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <DollarSign className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <p className="font-medium text-gray-900">디버그 도구</p>
                <p className="text-sm text-gray-500">시스템 진단 및 디버깅</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
