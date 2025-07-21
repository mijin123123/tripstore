# 관리자 계정 생성 및 설정 스크립트
# 실행방법: PowerShell -File setup-admin.ps1

# 환경 확인
Write-Host "환경 확인 중..." -ForegroundColor Cyan

# Node.js 버전 확인
try {
    $nodeVersion = node -v
    Write-Host "Node.js 버전: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "Node.js가 설치되어 있지 않습니다. 설치 후 다시 시도해주세요." -ForegroundColor Red
    exit
}

# 현재 디렉토리 확인
$currentDirectory = Get-Location
Write-Host "현재 디렉토리: $currentDirectory" -ForegroundColor Green

# .env 파일 존재 여부 확인
$envFile = ".env"
if (Test-Path $envFile) {
    Write-Host ".env 파일이 존재합니다." -ForegroundColor Green
}
else {
    Write-Host ".env 파일이 존재하지 않습니다. 환경 변수 설정이 필요합니다." -ForegroundColor Yellow
    
    # .env 파일 생성
    @"
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=당신의_SUPABASE_URL_입력
NEXT_PUBLIC_SUPABASE_ANON_KEY=당신의_SUPABASE_ANON_KEY_입력
"@ | Out-File -FilePath $envFile -Encoding utf8
    
    Write-Host ".env 파일이 생성되었습니다. Supabase URL과 ANON KEY를 입력해주세요." -ForegroundColor Yellow
    exit
}

# 필요한 패키지 설치 여부 확인
Write-Host "필요한 패키지 설치 여부 확인 중..." -ForegroundColor Cyan
npm list --depth=0 @supabase/ssr | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "@supabase/ssr 패키지가 설치되어 있지 않습니다. 설치합니다." -ForegroundColor Yellow
    npm install @supabase/ssr
}

# 관리자 계정 생성 스크립트 실행
Write-Host "관리자 계정 생성 스크립트 실행 중..." -ForegroundColor Cyan

# 관리자 이메일과 비밀번호 입력 받기
$adminEmail = Read-Host "관리자 이메일을 입력하세요"
$adminPassword = Read-Host "관리자 비밀번호를 입력하세요 (6자 이상)" -AsSecureString
$adminPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPassword))

if ($adminPasswordText.Length -lt 6) {
    Write-Host "비밀번호는 6자 이상이어야 합니다." -ForegroundColor Red
    exit
}

# 임시 Node.js 스크립트 생성
$tempScript = "temp-create-admin.js"

@"
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL 또는 ANON KEY가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
  try {
    // 1. 사용자 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: '$adminEmail',
      password: '$adminPasswordText',
    });

    if (authError) {
      console.error('사용자 생성 오류:', authError.message);
      return;
    }

    console.log('사용자가 생성되었습니다:', authData.user.id);

    // 2. 사용자를 관리자로 설정
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_admin: true, name: '관리자' })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('관리자 권한 부여 오류:', updateError.message);
      return;
    }

    console.log('관리자 권한이 부여되었습니다.');
    console.log('이메일 확인 후 로그인하여 관리자 페이지에 접속하세요.');

  } catch (error) {
    console.error('관리자 생성 중 오류 발생:', error.message);
  }
}

createAdmin();
"@ | Out-File -FilePath $tempScript -Encoding utf8

# dotenv 패키지가 없으면 설치
npm list --depth=0 dotenv | Out-Null
if ($LASTEXITCODE -ne 0) {
    npm install dotenv
}

# @supabase/supabase-js 패키지가 없으면 설치
npm list --depth=0 @supabase/supabase-js | Out-Null
if ($LASTEXITCODE -ne 0) {
    npm install @supabase/supabase-js
}

# 스크립트 실행
Write-Host "관리자 계정을 생성하는 중..." -ForegroundColor Cyan
node $tempScript

# 임시 스크립트 파일 삭제
Remove-Item $tempScript

Write-Host "`n관리자 계정 생성이 완료되었습니다." -ForegroundColor Green
Write-Host "이메일 확인 후 로그인하여 관리자 페이지에 접속하세요." -ForegroundColor Green

# Supabase 테이블 스키마 점검
Write-Host "`nSupabase 테이블 스키마 점검 중..." -ForegroundColor Cyan
Write-Host "users 테이블에 is_admin 필드가 boolean 타입으로 존재하는지 확인하세요." -ForegroundColor Yellow
Write-Host "Supabase Studio에서 다음 SQL을 실행하여 필드가 없다면 추가할 수 있습니다:" -ForegroundColor Yellow
Write-Host "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;" -ForegroundColor Blue

# 레이아웃 파일 검사
Write-Host "`n관리자 레이아웃 파일 점검 중..." -ForegroundColor Cyan
$adminLayoutPath = ".\src\app\admin\layout.tsx"

if (Test-Path $adminLayoutPath) {
    Write-Host "관리자 레이아웃 파일이 존재합니다." -ForegroundColor Green
    
    # admin 디렉토리 내 page.tsx 파일도 확인
    $adminPagePath = ".\src\app\admin\page.tsx"
    
    if (Test-Path $adminPagePath) {
        Write-Host "관리자 메인 페이지 파일이 존재합니다." -ForegroundColor Green
    }
    else {
        Write-Host "관리자 메인 페이지 파일이 존재하지 않습니다. 생성합니다." -ForegroundColor Yellow
        
        # 기본 관리자 메인 페이지 생성
        @"
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, Package, CalendarDays, CreditCard, Building, Hotel } from 'lucide-react'
import Link from 'next/link'

type Stats = {
  users: number
  packages: number
  bookings: number
  payments: number
  villas: number
  hotels: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    packages: 0,
    bookings: 0,
    payments: 0,
    villas: 0,
    hotels: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        const supabase = createClient()
        
        // 사용자 수
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        // 패키지 수
        const { count: packagesCount } = await supabase
          .from('packages')
          .select('*', { count: 'exact', head: true })
        
        // 예약 수
        const { count: bookingsCount } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
        
        // 결제 수
        const { count: paymentsCount } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          
        // 빌라 수
        const { count: villasCount } = await supabase
          .from('villas')
          .select('*', { count: 'exact', head: true })
          
        // 호텔 수
        const { count: hotelsCount } = await supabase
          .from('hotels')
          .select('*', { count: 'exact', head: true })
        
        // 최근 예약
        const { data: recentBookingsData } = await supabase
          .from('bookings')
          .select(`
            *,
            users (name, email),
            packages (title),
            villas (name),
            hotels (name)
          `)
          .order('created_at', { ascending: false })
          .limit(5)
          
        // 최근 사용자
        const { data: recentUsersData } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)
        
        setStats({
          users: usersCount || 0,
          packages: packagesCount || 0,
          bookings: bookingsCount || 0,
          payments: paymentsCount || 0,
          villas: villasCount || 0,
          hotels: hotelsCount || 0
        })
        
        setRecentBookings(recentBookingsData || [])
        setRecentUsers(recentUsersData || [])
      } catch (error) {
        console.error('통계 데이터 가져오기 오류:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStats()
  }, [])
  
  // 카드 컴포넌트
  const AdminCard = ({ title, value, icon, linkHref }: { title: string, value: number, icon: React.ReactNode, linkHref: string }) => (
    <Link href={linkHref} className="block">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value.toLocaleString()}</p>
          </div>
          <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  )
  
  if (isLoading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <AdminCard 
          title="사용자" 
          value={stats.users} 
          icon={<Users className="h-6 w-6 text-blue-600" />} 
          linkHref="/admin/users"
        />
        <AdminCard 
          title="패키지" 
          value={stats.packages} 
          icon={<Package className="h-6 w-6 text-blue-600" />} 
          linkHref="/admin/packages"
        />
        <AdminCard 
          title="빌라" 
          value={stats.villas} 
          icon={<Building className="h-6 w-6 text-blue-600" />} 
          linkHref="/admin/villas"
        />
        <AdminCard 
          title="호텔" 
          value={stats.hotels} 
          icon={<Hotel className="h-6 w-6 text-blue-600" />} 
          linkHref="/admin/hotels"
        />
        <AdminCard 
          title="예약" 
          value={stats.bookings} 
          icon={<CalendarDays className="h-6 w-6 text-blue-600" />} 
          linkHref="/admin/bookings"
        />
        <AdminCard 
          title="결제" 
          value={stats.payments} 
          icon={<CreditCard className="h-6 w-6 text-blue-600" />} 
          linkHref="/admin/payments"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 예약 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">최근 예약</h2>
          {recentBookings.length > 0 ? (
            <div className="divide-y">
              {recentBookings.map((booking) => {
                const bookingType = booking.package_id ? '패키지' : booking.hotel_id ? '호텔' : booking.villa_id ? '빌라' : '알 수 없음'
                const itemName = 
                  booking.packages?.title || 
                  booking.hotels?.name || 
                  booking.villas?.name || 
                  '알 수 없음'
                  
                return (
                  <div key={booking.id} className="py-3">
                    <div className="flex justify-between">
                      <p className="font-medium">{booking.users?.name || '알 수 없음'}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'}`}>
                        {booking.status === 'confirmed' ? '확정' :
                         booking.status === 'pending' ? '대기중' :
                         booking.status === 'cancelled' ? '취소됨' : booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{bookingType}: {itemName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(booking.created_at).toLocaleDateString()} ({booking.users?.email})
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500">예약 내역이 없습니다.</p>
          )}
        </div>
        
        {/* 최근 사용자 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">최근 사용자</h2>
          {recentUsers.length > 0 ? (
            <div className="divide-y">
              {recentUsers.map((user) => (
                <div key={user.id} className="py-3">
                  <div className="flex justify-between">
                    <p className="font-medium">{user.name || '이름 없음'}</p>
                    {user.is_admin && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">관리자</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">사용자가 없습니다.</p>
          )}
        </div>
      </div>
    </>
  )
}
"@ | Out-File -FilePath $adminPagePath -Encoding utf8
        
        Write-Host "관리자 메인 페이지 파일이 생성되었습니다." -ForegroundColor Green
    }
}
else {
    Write-Host "관리자 레이아웃 파일이 존재하지 않습니다." -ForegroundColor Red
    Write-Host "프로젝트의 src\app\admin 디렉토리에 layout.tsx 파일이 있는지 확인하세요." -ForegroundColor Yellow
}

Write-Host "`n환경 설정 및 관리자 계정 생성이 완료되었습니다." -ForegroundColor Green
Write-Host "1. 관리자 이메일 확인 및 인증을 완료하세요." -ForegroundColor Cyan
Write-Host "2. 로그인 후 '/admin' 경로로 접속하여 관리자 페이지에 접근하세요." -ForegroundColor Cyan
