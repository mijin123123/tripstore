import { Suspense } from "react";
import { Search, Filter } from "lucide-react";
import Image from "next/image";
import connectMongoDB from '@/lib/mongodb';
import Package from '@/models/Package';
import fallbackPackages from '@/lib/fallback-data';
import PackagesClient from './PackagesClient';

// 서버에서 패키지 데이터 가져오기 (간소화된 버전)
async function getPackages() {
	console.log('🔍 패키지 페이지: 데이터 로딩 시작');
	
	// 서버리스 환경 체크 (Netlify)
	const isNetlify = process.env.NETLIFY === 'true';
	const isDev = process.env.NODE_ENV === 'development';
	
	console.log(`📊 환경: ${isNetlify ? 'Netlify' : '일반'}, ${isDev ? '개발' : '프로덕션'}`);
	
	try {
		// Netlify 환경이면 바로 fallback 데이터 사용
		if (isNetlify) {
			console.log('📱 Netlify 환경 감지: 안정적 폴백 데이터 사용');
			return fallbackPackages;
		}
		
		// 로컬 환경에서는 직접 MongoDB 연결
		console.log('🔌 MongoDB 직접 연결 시도');
		await connectMongoDB();
		const packages = await Package.find({}).sort({ createdAt: -1 }).lean();
		
		console.log(`✅ MongoDB 데이터 로드 성공: ${packages.length}개`);
		
		if (packages.length === 0) {
			console.warn('⚠️ MongoDB에서 패키지를 찾지 못했습니다. 폴백 데이터 사용');
			return fallbackPackages;
		}
		
		// 직렬화 가능한 형태로 변환
		return packages.map((pkg: any) => ({
			id: pkg._id.toString(),
			destination: pkg.destination || pkg.title,
			type: pkg.category || "해외여행",
			title: pkg.title,
			description: pkg.description,
			price: pkg.price,
			duration: `${pkg.duration || 7}일`,
			image: pkg.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740",
			rating: 4.5,
			reviews: 128,
			name: pkg.title
		}));
	} catch (error) {
		console.error('❌ 패키지 데이터 로딩 실패:', error);
		console.log('⚠️ 폴백 데이터 사용:', fallbackPackages.length);
		return fallbackPackages;
	}
}

export default async function PackagesPage() {
	const packages = await getPackages();
	
	return (
		<div>
			{/* Hero Section */}
			<div className="relative h-[300px] bg-gradient-to-r from-gray-800 to-gray-900">
				<div className="absolute inset-0 overflow-hidden">
					<Image 
						src="https://images.unsplash.com/photo-1475066392170-59d55d96fe51?q=80&w=2070&auto=format&fit=crop"
						alt="여행 배경 이미지"
						fill
						className="object-cover opacity-50"
						priority
					/>
				</div>
				<div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/60 to-neutral-900/40"></div>
				<div className="container mx-auto px-4 h-full flex flex-col justify-center items-center relative z-10">
					<h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white text-center tracking-tight">
						나에게 딱 맞는 여행 찾기
					</h1>
					<p className="text-lg text-white/90 max-w-2xl text-center">
						TripStore가 엄선한 고품질 여행 상품으로 잊지 못할 여정을 시작하세요
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-8">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* 필터 사이드바 */}
					<div className="lg:w-1/4">
						<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
							<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
								<Filter className="w-5 h-5 text-blue-600" />
								상세 검색
							</h3>
							
							{/* 검색어 입력 */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">
									목적지
								</label>
								<div className="relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
									<input
										type="text"
										placeholder="목적지를 입력하세요"
										className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>
							</div>

							{/* 여행 타입 */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-3">
									여행 종류
								</label>
								<div className="space-y-2">
									{["모든 종류", "해외여행", "국내여행", "단체여행", "허니문", "가족여행", "겨울여행"].map((type) => (
										<button
											key={type}
											className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors hover:bg-blue-50"
										>
											{type}
										</button>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* 패키지 목록 */}
					<div className="lg:w-3/4">
						<Suspense fallback={
							<div className="text-center py-16">
								<div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
								<h3 className="text-xl font-semibold text-gray-500 mb-2">패키지를 불러오는 중...</h3>
							</div>
						}>
							{/* 클라이언트 컴포넌트로 패키지 목록 렌더링 */}
							<PackagesClient initialPackages={packages} />
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
