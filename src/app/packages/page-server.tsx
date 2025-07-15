import { Suspense } from "react";
import { Search, Filter, PackageX, Map, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { supabase } from '@/lib/supabase';

// 서버에서 패키지 데이터 가져오기
async function getPackages() {
	try {
		const { data: packages, error } = await supabase
			.from('packages')
			.select('*')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('패키지 데이터 로딩 실패:', error);
			return [];
		}
		
		// 직렬화 가능한 형태로 변환
		return packages.map((pkg: any) => ({
			id: pkg.id.toString(),
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
		console.error('패키지 데이터 로딩 실패:', error);
		return [];
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
						<div className="flex justify-between items-center mb-6">
							<div>
								<h2 className="text-2xl font-bold text-gray-900">
									여행 패키지
								</h2>
								<p className="text-gray-600 mt-1">
									총 {packages.length}개의 패키지
								</p>
							</div>
						</div>

						{packages.length === 0 ? (
							<div className="text-center py-16">
								<PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-gray-500 mb-2">
									검색 결과가 없습니다
								</h3>
								<p className="text-gray-400">
									다른 검색어나 필터를 사용해 보세요
								</p>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{packages.map((pkg) => (
									<Link
										key={pkg.id}
										href={`/packages/${pkg.id}`}
										className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
									>
										<div className="relative h-48 overflow-hidden">
											<Image
												src={pkg.image}
												alt={pkg.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
											<div className="absolute top-3 left-3">
												<span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
													{pkg.type}
												</span>
											</div>
										</div>
										<div className="p-4">
											<h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
												{pkg.title}
											</h3>
											<p className="text-sm text-gray-600 mb-2 line-clamp-2">
												{pkg.description}
											</p>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2 text-sm text-gray-500">
													<Map className="w-4 h-4" />
													<span>{pkg.destination}</span>
												</div>
												<div className="text-right">
													<div className="text-lg font-bold text-blue-600">
														{formatPrice(pkg.price)}
													</div>
													<div className="text-xs text-gray-500">
														{pkg.duration}
													</div>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
