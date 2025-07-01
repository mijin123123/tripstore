import { User, Map, Heart, Settings, LogOut, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: Map, text: '나의 예약 관리', href: '#' },
  { icon: Heart, text: '관심 여행 상품', href: '#' },
  { icon: User, text: '회원 정보 수정', href: '#' },
  { icon: Settings, text: '계정 설정', href: '#' },
  { icon: LogOut, text: '로그아웃', href: '#' },
];

const recentBookings = [
    { id: 1, name: '스위스 알프스 7일 완벽 일주', date: '2025-08-10 출발', status: '예약 확정', statusColor: 'text-green-600 bg-green-100' },
    { id: 2, name: '지중해의 보석, 산토리니', date: '2025-07-22 출발', status: '결제 대기', statusColor: 'text-yellow-600 bg-yellow-100' },
    { id: 3, name: '낭만의 도시, 파리 5일', date: '2025-05-15 출발', status: '여행 완료', statusColor: 'text-neutral-gray-500 bg-neutral-gray-100' },
]

export default function MyPage() {
    return (
        <div className="bg-soft-blue/30 min-h-screen">
            <div className="container mx-auto px-6 py-24 sm:py-32">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-gray-800 sm:text-5xl">마이페이지</h1>
                    <p className="mt-6 text-lg leading-8 text-neutral-gray-600">홍길동님의 여행 현황을 한눈에 확인하세요.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar Menu */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-6 rounded-lg shadow-soft-strong">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-neutral-gray-200 rounded-full flex items-center justify-center">
                                    <User size={32} className="text-neutral-gray-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-gray-900">홍길동님</h2>
                                    <p className="text-sm text-neutral-gray-600">gildong@example.com</p>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                {menuItems.map((item) => (
                                    <a key={item.text} href={item.href} className="flex items-center justify-between px-4 py-3 text-neutral-gray-700 rounded-md hover:bg-neutral-gray-100 hover:text-soft-blue-dark transition-colors duration-200">
                                        <div className="flex items-center">
                                            <item.icon className="h-5 w-5 mr-3" />
                                            <span>{item.text}</span>
                                        </div>
                                        <ChevronRight size={16} />
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <div className="bg-white p-8 rounded-lg shadow-soft-strong">
                            <h2 className="text-2xl font-bold text-neutral-gray-900 mb-6">최근 예약 내역</h2>
                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div key={booking.id} className="border border-neutral-gray-200 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div>
                                            <h3 className="font-semibold text-lg text-neutral-gray-800">{booking.name}</h3>
                                            <p className="text-sm text-neutral-gray-600 mt-1">{booking.date}</p>
                                        </div>
                                        <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${booking.statusColor}`}>{booking.status}</span>
                                            <a href="#" className="text-sm font-medium text-soft-blue-dark hover:underline">상세보기</a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
