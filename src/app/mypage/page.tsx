import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { User, Map, Heart, Settings, LogOut, ChevronRight, Package } from 'lucide-react';
import Link from "next/link";

// 데이터 타입을 명시적으로 정의합니다.
interface PackageInfo {
  id: string;
  title: string | null;
  start_date: string | null;
}

interface Reservation {
  id: string;
  status: string | null;
  packages: PackageInfo | null; // packages는 단일 객체이거나 null일 수 있습니다.
}

const menuItems = [
  { icon: Map, text: '나의 예약 관리', href: '/mypage' },
  { icon: Heart, text: '관심 여행 상품', href: '#' },
  { icon: User, text: '회원 정보 수정', href: '#' },
  { icon: Settings, text: '계정 설정', href: '#' },
];

const getStatusStyle = (status: string | null) => {
    switch (status) {
        case '예약 확정':
            return 'text-green-700 bg-green-100';
        case '결제 대기':
            return 'text-yellow-700 bg-yellow-100';
        case '여행 완료':
            return 'text-gray-700 bg-gray-100';
        case '예약 취소':
            return 'text-red-700 bg-red-100';
        default:
            return 'text-gray-700 bg-gray-100';
    }
}

export default async function MyPage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    // Supabase는 foreign key 관계를 객체로 반환합니다.
    const { data, error } = await supabase
        .from('reservations')
        .select(`
            id,
            status,
            packages (
                id,
                title,
                start_date
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reservations:', error);
        return (
            <div className="text-center py-10">
                <p>예약 정보를 불러오는 중 오류가 발생했습니다.</p>
            </div>
        )
    }
    
    const reservations: Reservation[] = data || [];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">마이페이지</h1>
                    <p className="mt-4 text-lg leading-8 text-gray-600">{(user.user_metadata?.full_name) || user.email}님의 여행 현황을 한눈에 확인하세요.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Sidebar Menu */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <div className="flex items-center space-x-4 mb-8">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User size={32} className="text-gray-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{(user.user_metadata?.full_name) || '사용자'}</h2>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <Link key={item.text} href={item.href} className="flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 font-medium">
                                        <div className="flex items-center">
                                            <item.icon className="h-5 w-5 mr-3" />
                                            <span>{item.text}</span>
                                        </div>
                                        <ChevronRight size={16} />
                                    </Link>
                                ))}
                                 <form action="/auth/signout" method="post">
                                    <button type="submit" className="w-full flex items-center justify-between px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 font-medium">
                                        <div className="flex items-center">
                                            <LogOut className="h-5 w-5 mr-3" />
                                            <span>로그아웃</span>
                                        </div>
                                        <ChevronRight size={16} />
                                    </button>
                                </form>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 예약 내역</h2>
                            <div className="space-y-4">
                                {reservations && reservations.length > 0 ? (
                                    reservations.map((booking) => (
                                        <div key={booking.id} className="border border-gray-200 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h3 className="font-semibold text-lg text-gray-800">{booking.packages?.title || '패키지 정보 없음'}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{booking.packages?.start_date ? `${new Date(booking.packages.start_date).toLocaleDateString()} 출발` : '날짜 정보 없음'}</p>
                                            </div>
                                            <div className="flex items-center space-x-4 flex-shrink-0">
                                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyle(booking.status)}`}>{booking.status}</span>
                                                <Link href={`/mypage/reservations/${booking.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                                                    상세보기
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-6 border-2 border-dashed border-gray-200 rounded-lg">
                                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                                        <h3 className="mt-2 text-lg font-medium text-gray-900">예약 내역이 없습니다.</h3>
                                        <p className="mt-1 text-sm text-gray-500">새로운 여행을 예약하고 추억을 만들어보세요!</p>
                                        <div className="mt-6">
                                            <Link href="/packages" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                                여행 상품 보러가기
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
