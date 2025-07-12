import { Suspense } from "react";
import { Search, Filter } from "lucide-react";
import Image from "next/image";
import hardcodedPackages from '@/lib/hardcoded-data';
import PackagesClient from './PackagesClient';

/**
 * 패키지 페이지 - 단순화된 버전
 * 
 * 서버리스 환경에서 안정적인 렌더링을 위해 완전히 정적 데이터를 사용합니다.
 * 클라이언트 컴포넌트에서 추가로 MongoDB 데이터를 가져오도록 시도합니다.
 */
export default function PackagesPage() {
	// 하드코딩된 데이터 사용 (안정적 렌더링 보장)
	const packages = hardcodedPackages;
	
	// 로그 기록
	console.log(`📦 패키지 페이지: ${packages.length}개의 하드코딩된 패키지 제공`);
	
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
