import { redirect } from "next/navigation";
import { User, Map, Heart, Settings, ChevronRight, Package, AlertTriangle } from 'lucide-react';
import Link from "next/link";
import { db } from "@/lib/neon";
import { reservations as reservationsSchema, packages as packagesSchema } from "@/lib/schema";
import { InferSelectModel, eq } from 'drizzle-orm';

// Drizzle의 InferSelectModel을 사용하여 스키마로부터 타입을 추론합니다.
type ReservationSelect = InferSelectModel<typeof reservationsSchema>;
type PackageSelect = InferSelectModel<typeof packagesSchema>;

// Join 쿼리 결과에 대한 타입을 정의합니다.
// Drizzle은 join된 테이블의 데이터를 테이블 이름의 키로 갖는 객체로 반환합니다.
type ReservationWithPackage = {
  reservations: ReservationSelect;
  packages: PackageSelect | null;
};

// 임시 사용자 정보 (인증 기능 구현 전까지 사용)
// 중요: 이 ID는 실제 데이터베이스의 reservations 테이블에 존재하는 user_id여야 합니다.
const tempUser = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", // Supabase에서 사용하던 유효한 user_id로 교체해야 합니다.
  fullName: "홍길동 (임시)",
  email: "temp.user@example.com",
};

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
        case 'pending': // Drizzle 스키마의 기본값
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
    try {
        // TODO: 실제 인증 시스템과 연동 필요
        const user = tempUser;

        if (!user) {
            return redirect('/login');
        }

        // Drizzle을 사용하여 예약 정보와 관련 패키지 정보를 join하여 가져옵니다.
        const reservationsWithPackages: ReservationWithPackage[] = await db
            .select({
                reservations: reservationsSchema,
                packages: packagesSchema
            })
            .from(reservationsSchema)
            .leftJoin(packagesSchema, eq(reservationsSchema.packageId, packagesSchema.id))
            .where(eq(reservationsSchema.userId, user.id))
            .orderBy(reservationsSchema.createdAt);

        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">마이페이지</h1>
                        <p className="mt-4 text-lg leading-8 text-gray-600">{user.fullName || user.email}님의 여행 현황을 한눈에 확인하세요.</p>
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
                                        <h2 className="text-xl font-bold text-gray-800">{user.fullName || '사용자'}</h2>
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
                                     {/* TODO: 인증 구현 후 로그아웃 기능 추가 */}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-9">
                            <div className="bg-white p-8 rounded-xl shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">최근 예약 내역</h2>
                                <div className="space-y-4">
                                    {reservationsWithPackages.length > 0 ? (
                                        reservationsWithPackages.map((booking) => (
                                            <div key={booking.reservations.id} className="border border-gray-200 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">{booking.packages?.title || '패키지 정보 없음'}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{booking.reservations.departureDate ? `${new Date(booking.reservations.departureDate).toLocaleDateString()} 출발` : '날짜 정보 없음'}</p>
                                                </div>
                                                <div className="flex items-center space-x-4 flex-shrink-0">
                                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusStyle(booking.reservations.status)}`}>{booking.reservations.status}</span>
                                                    <Link href={`/mypage/reservations/${booking.reservations.id}`} className="text-sm font-medium text-blue-600 hover:underline">
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
    } catch (error) {
        console.error('[MyPage Error]', error);
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-red-200">
                        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                        <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">페이지 오류</h1>
                        <p className="mt-4 text-base text-gray-600">페이지를 표시하는 중 예상치 못한 오류가 발생했습니다.</p>
                        <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
                        <div className="mt-8">
                            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                홈으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
