"use client";

import { useMemo, Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, PackageX, Map, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

function PackagesContent() {
	const searchParams = useSearchParams();
	const [searchTerm, setSearchTerm] = useState(
		searchParams.get("destination") || ""
	);
	const [selectedType, setSelectedType] = useState(
		searchParams.get("type") || "모든 종류"
	);
	const [packages, setPackages] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// API에서 패키지 데이터 가져오기
	useEffect(() => {
		const fetchPackages = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/packages');
				
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				
				const data = await response.json();
				const packagesArray = Array.isArray(data) ? data : (data.packages || []);
				
				// DB 데이터를 packagesData 형식으로 변환
				const formattedPackages = packagesArray.map((pkg: any) => ({
					id: pkg._id || pkg.id, // MongoDB의 _id 필드 우선 사용
					destination: pkg.destination || pkg.title, // destination 필드가 없으면 title 사용
					type: pkg.category || "해외여행", // category를 type으로 매핑
					title: pkg.title,
					description: pkg.description,
					price: pkg.price,
					duration: `${pkg.duration || 7}일`,
					image: pkg.image_url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740",
					rating: 4.5, // 기본값
					reviews: 128, // 기본값
					name: pkg.title // 기존 코드와의 호환성을 위해 추가
				}));
				
				setPackages(formattedPackages);
			} catch (error) {
				console.error('패키지 데이터 로딩 실패:', error);
				setPackages([]); // 에러 시 빈 배열
			} finally {
				setLoading(false);
			}
		};

		fetchPackages();
	}, []);

	useEffect(() => {
		const destination = searchParams.get("destination") || "";
		const type = searchParams.get("type") || "모든 종류";
		setSearchTerm(destination);
		setSelectedType(type);
	}, [searchParams]);

	const filteredAndSortedPackages = useMemo(() => {
		return packages.filter((pkg) => {
			const matchesSearch = pkg.destination
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
			const matchesType =
				selectedType === "모든 종류" || pkg.type === selectedType;
			return matchesSearch && matchesType;
		});
	}, [packages, searchTerm, selectedType]);

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

			<div className="container mx-auto px-4 -mt-6 relative z-20 mb-8">
				{/* 검색 바 */}
				<div className="bg-white rounded-xl shadow-md p-4 max-w-3xl mx-auto">
					<div className="flex items-center">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-black" />
							<input
								type="text"
								placeholder="어디로 떠나고 싶으신가요?"
								className="w-full pl-10 p-2 border-0 focus:outline-none focus:ring-0 text-neutral-800 font-medium placeholder-neutral-500"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="border-l border-gray-200 mx-2 h-6"></div>
						<div className="relative flex items-center">
							<select
								className="appearance-none border-0 p-2 pr-8 focus:outline-none focus:ring-0 bg-transparent text-neutral-800 font-medium"
								value={selectedType}
								onChange={(e) => setSelectedType(e.target.value)}
							>
								<option>모든 종류</option>
								<option>휴양</option>
								<option>문화탐방</option>
								<option>어드벤처</option>
								<option>커플</option>
							</select>
						</div>
					</div>
				</div>

				<div className="container mx-auto px-4 py-8">
					{/* 필터 및 정렬 버튼 */}
					<div className="flex flex-wrap items-center justify-between mb-6">
						<div className="flex items-center mb-3 md:mb-0">
							<Filter className="w-5 h-5 mr-2 text-blue-500" />
							<h2 className="text-lg font-medium text-gray-700">상세 검색</h2>
						</div>
						<div className="flex flex-wrap gap-2">
							{["모든 종류", "휴양", "문화탐방", "어드벤처", "커플"].map((type) => (
								<button
									key={type}
									className={`px-3 py-1 text-sm border border-gray-200 rounded-md transition-colors ${
										selectedType === type
											? "bg-gray-800 text-white border-gray-800" 
											: "bg-white text-gray-700 hover:bg-gray-50"
									}`}
									onClick={() => setSelectedType(type)}
								>
									{type}
								</button>
							))}
						</div>
					</div>
					
					{/* 결과 카운터 */}
					<div className="mb-6">
						{loading ? (
							<div className="flex items-center space-x-2">
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
								<h2 className="text-xl font-bold text-gray-800">패키지를 불러오는 중...</h2>
							</div>
						) : (
							<h2 className="text-xl font-bold text-gray-800">
								{filteredAndSortedPackages.length > 0 ? (
									<>발견된 여행 상품 <span className="text-gray-500">{filteredAndSortedPackages.length}개</span></>
								) : '검색 결과 없음'}
							</h2>
						)}
					</div>
					
					{/* Packages Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{loading ? (
							// 로딩 상태에서 스켈레톤 UI 표시
							Array.from({ length: 6 }).map((_, index) => (
								<div key={index} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden animate-pulse">
									<div className="h-48 bg-gray-200"></div>
									<div className="p-4">
										<div className="h-6 bg-gray-200 rounded mb-2"></div>
										<div className="h-4 bg-gray-200 rounded mb-3"></div>
										<div className="h-4 bg-gray-200 rounded w-2/3"></div>
									</div>
								</div>
							))
						) : filteredAndSortedPackages.length > 0 ? (
							filteredAndSortedPackages.map((pkg) => (
								<Link
									href={`/packages/${pkg.id}`}
									key={pkg.id}
									className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col h-full"
								>
									<div className="relative h-48 w-full overflow-hidden">
										<Image
											src={pkg.image}
											alt={pkg.name}
											fill
											sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											className="object-cover"
										/>
										<div className="absolute top-3 left-3">
											<span className="bg-white py-1 px-2 text-xs font-medium text-gray-800 rounded-sm">
												{pkg.type}
											</span>
										</div>
									</div>
									<div className="p-4 flex flex-col flex-grow">
										<h3 className="text-lg font-bold text-gray-800 mb-1">
											{pkg.name}
										</h3>
										<p className="text-gray-600 text-sm mb-3 line-clamp-2">
											{pkg.description}
										</p>
										<div className="flex items-center justify-between mt-auto">
											<span className="text-lg font-bold text-gray-900">
												{formatPrice(pkg.price)}
											</span>
										</div>
									</div>
								</Link>
							))
						) : (
							<div className="col-span-1 md:col-span-2 lg:col-span-3">
								<div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white border border-gray-100 rounded-lg">
									<PackageX className="w-16 h-16 text-gray-300 mb-6" />
									<h3 className="text-2xl font-bold text-gray-800 mb-2">
										검색 결과가 없습니다
									</h3>
									<p className="text-gray-500 max-w-md mb-6">
										다른 검색어나 필터를 사용해 보세요. 멋진 여행이
										당신을 기다리고 있을 거예요!
									</p>
									<button 
										onClick={() => {
											setSearchTerm("");
											setSelectedType("모든 종류");
										}}
										className="px-4 py-2 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors"
									>
										모든 여행 보기
									</button>
								</div>
							</div>
						)}
					</div>
					<div className="mt-10 text-center text-gray-500 text-sm">
						<p>목적지를 선택하고 완벽한 여행을 계획해보세요</p>
						<p>더 많은 상품이 업데이트 됩니다</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function PackagesPage() {
	return (
		<Suspense fallback={
			<div className="h-screen w-full flex items-center justify-center">
				<div className="animate-pulse flex flex-col items-center">
					<div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-3"></div>
					<p className="text-sm text-gray-600">로딩 중...</p>
				</div>
			</div>
		}>
			<PackagesContent />
		</Suspense>
	);
}
