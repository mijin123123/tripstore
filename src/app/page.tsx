"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
	MapPin, 
	Search, 
	Star, 
	Award, 
	ThumbsUp, 
	ShieldCheck,
	Percent,
	Calendar,
	Globe,
	Users,
	Mail,
	ArrowRight,
	Send,
	Plane,
	Briefcase,
	Camera,
	HelpCircle
} from "lucide-react";
import { packagesData } from "@/data/packagesData";

// 추천 패키지 데이터 (메인 페이지용 정제된 데이터)
// featuredPackages 데이터는 packagesData와 id를 일치시킵니다
const featuredPackages = [
	{
		id: "bali-luxury-villa",
		name: "발리 럭셔리 빌라 휴양",
		description: "프라이빗 풀장이 있는 럭셔리 빌라에서 완벽한 휴식을 즐기세요.",
		price: "1,990,000",
		rating: "4.9",
		image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740"
	},
	{
		id: "tokyo-culture",
		name: "도쿄 문화 탐방",
		description: "현대적인 도시와 전통이 공존하는 도쿄의 문화를 경험하세요.",
		price: "1,290,000",
		rating: "4.8",
		image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1753"
	},
	{
		id: "paris-romance",
		name: "파리 로맨틱 투어",
		description: "세계에서 가장 낭만적인 도시에서 특별한 추억을 만들어보세요.",
		price: "2,390,000",
		rating: "4.7",
		image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1742"
	}
];

// 인기 여행지 데이터
const popularDestinations = [
	{
		name: "파리",
		country: "프랑스",
		image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1740",
		count: 28
	},
	{
		name: "도쿄",
		country: "일본",
		image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?q=80&w=1636",
		count: 24
	},
	{
		name: "뉴욕",
		country: "미국",
		image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1740",
		count: 32
	},
	{
		name: "바르셀로나",
		country: "스페인",
		image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=1740",
		count: 18
	},
	{
		name: "발리",
		country: "인도네시아",
		image: "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?q=80&w=1735",
		count: 22
	},
	{
		name: "서울",
		country: "한국",
		image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1740",
		count: 26
	}
];

// 특별 할인 상품 데이터
const specialOffers = [
	{
		id: "jeju-healing",
		name: "제주 힐링 3일",
		description: "에메랄드 빛 바다와 청정 자연을 만끽하는 제주도 힐링 여행",
		regularPrice: "890,000",
		discountPrice: "599,000",
		discountRate: 33,
		endDate: "2025년 7월 15일",
		image: "https://images.unsplash.com/photo-1561424111-c47df0f91351?q=80&w=1726"
	},
	{
		id: "kyoto-autumn",
		name: "교토 단풍 특집",
		description: "가을의 정취가 물든 교토의 사찰과 정원 순례",
		regularPrice: "1,290,000",
		discountPrice: "990,000",
		discountRate: 23,
		endDate: "2025년 8월 30일",
		image: "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?q=80&w=1740"
	},
	{
		id: "danang-golf",
		name: "다낭 골프 패키지",
		description: "해변과 골프를 동시에 즐기는 프리미엄 다낭 골프 여행",
		regularPrice: "1,590,000",
		discountPrice: "1,190,000",
		discountRate: 25,
		endDate: "2025년 7월 31일",
		image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1750"
	}
];

// 시즌별 추천 패키지
const seasonalPackages = [
	{
		title: "여름 추천 여행",
		packages: [
			{
				id: "maldives-summer",
				name: "몰디브 여름 에디션",
				price: "2,890,000",
				image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1365"
			},
			{
				id: "hawaii-beach",
				name: "하와이 비치 패키지",
				price: "3,190,000",
				image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=1374"
			}
		]
	},
	{
		title: "가을 추천 여행",
		packages: [
			{
				id: "europe-autumn",
				name: "유럽 가을 낭만",
				price: "2,790,000",
				image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1740"
			},
			{
				id: "korea-autumn",
				name: "한국의 가을",
				price: "690,000",
				image: "https://images.unsplash.com/photo-1604430352727-c0cd66be47aa?q=80&w=1770"
			}
		]
	},
	{
		title: "겨울 추천 여행",
		packages: [
			{
				id: "swiss-winter",
				name: "스위스 스키 여행",
				price: "3,290,000",
				image: "https://images.unsplash.com/photo-1551867633-194f125bddfa?q=80&w=1740"
			},
			{
				id: "japan-winter",
				name: "일본 온천 여행",
				price: "1,690,000",
				image: "https://images.unsplash.com/photo-1493514789931-586cb221d7a7?q=80&w=1741"
			}
		]
	}
];

// 왜 TripStore 선택하는지 데이터
const whyChooseUs = [
	{
		title: "프리미엄 서비스",
		description: "다년간의 노하우를 바탕으로 고객님께 최고의 여행 서비스를 제공합니다.",
		icon: Award
	},
	{
		title: "맞춤형 여행 설계",
		description: "여행 전문가가 고객님의 취향과 요구에 맞는 최적의 여행을 설계합니다.",
		icon: ThumbsUp
	},
	{
		title: "안전한 여행 보장",
		description: "24시간 현지 긴급 지원 서비스와 여행 보험으로 안전한 여행을 보장합니다.",
		icon: ShieldCheck
	}
];

// 고객 후기 데이터
const customerReviews = [
	{
		name: "김지혜",
		date: "2025.06.15",
		rating: 5,
		package: "발리 럭셔리 빌라 휴양",
		comment: "정말 잊지 못할 여행이었습니다. 빌라는 사진보다 더 좋았고, 서비스도 완벽했어요. 특히 현지 가이드분이 친절하게 안내해주셔서 더욱 즐거운 시간이었습니다."
	},
	{
		name: "이상현",
		date: "2025.06.10",
		rating: 4,
		package: "도쿄 문화 탐방",
		comment: "일본 여행은 여러 번 다녀왔지만 이번 패키지로 새로운 경험을 했어요. 가이드북에 나오지 않는 현지인 맛집을 많이 알게 되어 좋았습니다."
	},
	{
		name: "박민준",
		date: "2025.06.05",
		rating: 5,
		package: "파리 로맨틱 투어",
		comment: "신혼여행으로 다녀왔는데, 정말 로맨틱한 시간이었어요. 에펠탑에서의 디너는 평생 잊지 못할 추억이 되었습니다. 세심한 준비에 감사드립니다."
	}
];

// 여행 팁 데이터
const travelTips = [
	{
		title: "여행 필수품",
		description: "여행지에 따라 꼭 챙겨야 할 필수품 목록과 현지에서 구하기 어려운 물품을 미리 체크하세요.",
		icon: Briefcase
	},
	{
		title: "현지 문화 이해하기",
		description: "방문하는 나라의 기본 예절과 문화적 금기사항을 미리 알아두면 더 풍요로운 여행이 됩니다.",
		icon: Globe
	},
	{
		title: "사진 촬영 팁",
		description: "여행의 추억을 더 아름답게 담기 위한 기본적인 사진 촬영 팁과 인생샷 포인트를 소개합니다.",
		icon: Camera
	},
	{
		title: "안전한 여행하기",
		description: "해외여행 시 주의해야 할 안전 수칙과 위급상황 대처법을 알려드립니다.",
		icon: Users
	}
];

// 자주 묻는 질문
const faqs = [
	{
		question: "패키지 여행에는 어떤 것들이 포함되어 있나요?",
		answer: "기본적으로 항공, 숙박, 식사(조식 포함), 공항-호텔 간 이동 교통편이 포함됩니다. 상품에 따라 현지 투어와 가이드 서비스가 추가될 수 있습니다. 각 패키지 상세 페이지에서 정확한 포함 사항을 확인하실 수 있습니다."
	},
	{
		question: "예약 취소 및 환불 정책은 어떻게 되나요?",
		answer: "출발 30일 전까지는 전액 환불, 15일 전까지는 80% 환불, 7일 전까지는 50% 환불이 가능합니다. 출발 7일 이내 취소 시에는 환불이 불가능합니다. 일부 특가 상품은 별도의 취소 정책이 적용될 수 있으니 예약 전 확인해주세요."
	},
	{
		question: "여행 준비를 위한 조언을 얻을 수 있을까요?",
		answer: "네, 예약 확정 후 담당 여행 컨설턴트가 배정되어 필요한 서류, 준비물, 현지 정보 등을 안내해드립니다. 또한 출발 전 오리엔테이션을 통해 여행지에 대한 상세한 정보를 제공해드립니다."
	},
	{
		question: "단체가 아닌 개인 맞춤 여행도 가능한가요?",
		answer: "네, 프라이빗 투어 옵션을 선택하시면 개인 또는 가족 단위의 맞춤형 여행이 가능합니다. 원하시는 일정과 선호도를 알려주시면 전문 컨설턴트가 최적의 여행 계획을 설계해 드립니다."
	}
];

export default function Home() {
	const router = useRouter();
	const [destination, setDestination] = useState("");
	const [tripType, setTripType] = useState("모든 종류");
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);

	const handleSearch = (e) => {
		e.preventDefault();
		if (destination) {
			router.push(`/packages?destination=${encodeURIComponent(destination)}&type=${encodeURIComponent(tripType)}`);
		}
	};

	const handleSubscribe = (e) => {
		e.preventDefault();
		// 이메일 유효성 검사
		if (email && /^\S+@\S+\.\S+$/.test(email)) {
			// 실제 구현에서는 API 호출로 대체
			setIsSubscribed(true);
			setEmail("");
		}
	};

	return (
		<main>
			{/* Hero Section */}
			<section className="relative h-[650px] flex items-center justify-center text-white">
				<div className="absolute inset-0">
					<Image
						src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
						alt="Hero background"
						fill
						className="object-cover image-filter-warm"
						style={{ objectFit: "cover" }}
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/50 to-transparent"></div>
				</div>
				<div className="relative z-10 text-center px-4 animate-fade-in">
					<h1
						className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-balance"
						style={{
							textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
						}}
					>
						어디로 떠나고 싶으신가요?
					</h1>
					<p
						className="text-xl md:text-2xl max-w-3xl mx-auto text-neutral-100 mb-8"
						style={{
							textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
						}}
					>
						당신의 다음 여행, TripStore의 전문가들과 함께 잊지 못할
						추억으로 만들어보세요.
					</p>
					<div className="inline-block animate-bounce delay-1000">
						<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
						</svg>
					</div>
				</div>
			</section>

			{/* Search Form Section */}
			<section className="mt-12 relative z-20">
				<div className="container mx-auto px-4">
					<form
						onSubmit={handleSearch}
						className="bg-white p-8 rounded-2xl shadow-soft-2xl max-w-4xl mx-auto border border-neutral-100 animate-scale-in"
					>
						<h2 className="text-xl font-bold text-center mb-6 text-neutral-800">어디로 떠나고 싶으신가요?</h2>
						<div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
							<div className="md:col-span-5">
								<label
									htmlFor="destination"
									className="block text-sm font-bold text-neutral-800 mb-2"
								>
									여행지
								</label>
								<div className="relative">
									<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
									<input
										type="text"
										id="destination"
										className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-neutral-300 rounded-lg p-3.5 transition text-neutral-800 font-medium placeholder-neutral-500 hover:border-blue-300"
										placeholder="도시나 국가를 입력하세요"
										value={destination}
										onChange={(e) => setDestination(e.target.value)}
									/>
								</div>
							</div>
							<div className="md:col-span-4">
								<label
									htmlFor="trip-type"
									className="block text-sm font-bold text-neutral-800 mb-2"
								>
									여행 종류
								</label>
								<div className="relative">
									<Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500" />
									<select
										id="trip-type"
										className="pl-10 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-neutral-300 rounded-lg p-3.5 transition text-neutral-800 font-medium cursor-pointer hover:border-blue-300"
										value={tripType}
										onChange={(e) => setTripType(e.target.value)}
									>
										<option value="모든 종류">모든 종류</option>
										<option value="휴양">휴양</option>
										<option value="관광">관광</option>
										<option value="어드벤처">어드벤처</option>
										<option value="커플">커플</option>
									</select>
								</div>
							</div>
							<div className="md:col-span-3">
								<button
									type="submit"
									className="bg-gradient-blue text-white px-6 py-3.5 rounded-lg font-bold hover:opacity-90 transition-all duration-300 w-full flex items-center justify-center shadow-md hover:shadow-lg"
								>
									<Search className="h-5 w-5 mr-2 text-white" />
									검색
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>

			{/* 인기 여행지 섹션 */}
			<section className="py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-3">인기 여행지</span>
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight mb-4">
							최고 인기 여행지
						</h2>
						<p className="mt-3 text-lg text-neutral-600 max-w-2xl mx-auto">
							전세계 여행자들이 가장 많이 찾는 인기 도시들을 소개합니다.
						</p>
						<div className="w-20 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
					</div>
					
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
						{popularDestinations.map((destination, index) => (
							<Link href={`/packages?destination=${destination.name}`} key={destination.name} className="group">
								<div 
									className="relative h-64 rounded-2xl overflow-hidden shadow-md transform transition-all duration-500 hover-lift"
									style={{ animationDelay: `${index * 100}ms` }}
								>
									<Image
										src={destination.image}
										alt={destination.name}
										fill
										className="object-cover transition-transform duration-700 group-hover:scale-110"
										style={{ objectFit: "cover" }}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-neutral-900/90 via-neutral-900/60 to-transparent group-hover:from-blue-900/80 transition-all duration-300">
										<div className="absolute bottom-0 p-5 w-full transform transition-transform duration-300 group-hover:translate-y-0 translate-y-2">
											<h3 className="text-xl font-bold text-white mb-1">
												{destination.name}
											</h3>
											<p className="text-white/90 text-sm mb-2 opacity-90">
												{destination.country}
											</p>
											<div className="flex items-center space-x-1">
												<div className="mt-1 inline-flex items-center text-white/90 text-sm bg-white/20 px-2.5 py-1 rounded-full">
													<Globe className="h-3.5 w-3.5 mr-1.5" />
													{destination.count}개의 패키지
												</div>
												<div className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
													<ArrowRight className="h-3.5 w-3.5 text-white" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Featured Packages Section */}
			<section className="py-28 bg-neutral-50 relative">
				<div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-white to-transparent"></div>
				<div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
				<div className="absolute right-0 top-1/4 w-96 h-96 rounded-full bg-blue-100/40 filter blur-3xl"></div>
				<div className="absolute left-0 bottom-1/4 w-96 h-96 rounded-full bg-yellow-100/30 filter blur-3xl"></div>
				
				<div className="container mx-auto px-4 relative z-10">
					<div className="text-center mb-16">
						<span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-3">베스트셀러</span>
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight mb-4">
							추천 여행 상품
						</h2>
						<p className="mt-3 text-lg text-neutral-600 max-w-2xl mx-auto">
							고객님들이 가장 사랑한 TripStore의 베스트셀러 상품들을
							만나보세요.
						</p>
						<div className="w-20 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
						{featuredPackages.map((pkg, index) => (
							<Link href={`/packages/${pkg.id}`} key={pkg.id}>
								<div 
									className="bg-white rounded-2xl shadow-lifted overflow-hidden transform transition-all duration-500 cursor-pointer hover:shadow-glow group"
									style={{ animationDelay: `${index * 150}ms` }}
								>
									<div className="relative h-72 overflow-hidden">
										<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent z-10"></div>
										<Image
											src={pkg.image}
											alt={pkg.name}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
											style={{ objectFit: "cover" }}
										/>
										<div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md text-neutral-800 px-3 py-1.5 rounded-full text-sm font-bold flex items-center shadow-subtle">
											<Star className="h-4 w-4 text-yellow-500 mr-1.5" fill="currentColor" />
											{pkg.rating}
										</div>
									</div>
									<div className="p-7">
										<h3 className="font-bold text-2xl mb-2 text-neutral-900 group-hover:text-blue-600 transition-colors">
											{pkg.name}
										</h3>
										<p className="text-neutral-600 mb-5">
											{pkg.description}
										</p>
										<div className="flex justify-between items-center">
											<div className="text-right font-extrabold text-2xl text-blue-600">
												₩{pkg.price}
											</div>
											<span className="inline-flex items-center text-sm font-semibold text-blue-700 group-hover:translate-x-1 transition-transform">
												자세히 보기 <ArrowRight className="ml-1.5 h-4 w-4" />
											</span>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
					
					<div className="text-center mt-14">
						<Link href="/packages" className="inline-flex items-center px-6 py-3 bg-white border border-blue-500 text-blue-600 font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition-colors">
							모든 패키지 보기
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>

			{/* 특별 할인 섹션 */}
			<section className="py-24 bg-white relative overflow-hidden">
				<div className="absolute -right-32 -top-32 w-96 h-96 rounded-full bg-red-500/10 blur-3xl"></div>
				<div className="absolute -left-32 top-40 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
				
				<div className="container mx-auto px-4 relative z-10">
					<div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
						<div>
							<span className="bg-red-100 text-red-700 text-sm font-semibold px-3 py-1 rounded-full inline-block mb-3">한정 특가</span>
							<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight mb-3">
								특별 할인 이벤트
							</h2>
							<p className="text-lg text-neutral-600 max-w-2xl">
								TripStore 그랜드 오픈 기념, 특별 할인가로 상품을 만나보세요.
							</p>
							<div className="w-20 h-1.5 bg-red-500 mt-6 rounded-full md:hidden"></div>
						</div>
						<div className="mt-6 md:mt-0 flex items-center text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full shadow-sm">
							<Calendar className="h-4 w-4 mr-1.5" />
							<span>~2025년 7월 15일까지</span>
						</div>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{specialOffers.map((offer, index) => (
							<Link href={`/packages/${offer.id}`} key={offer.id}>
								<div 
									className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover-lift"
									style={{ animationDelay: `${index * 150}ms` }}
								>
									<div className="relative">
										<Image
											src={offer.image}
											alt={offer.name}
											width={400}
											height={250}
											className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
											style={{ objectFit: "cover" }}
										/>
										<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent"></div>
										<div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center shadow-sm">
											<Percent className="h-3.5 w-3.5 mr-1.5" />
											{offer.discountRate}% 할인
										</div>
									</div>
									<div className="p-7">
										<h3 className="font-bold text-xl mb-2 text-neutral-900 group-hover:text-blue-600 transition-colors">
											{offer.name}
										</h3>
										<p className="text-neutral-600 mb-4">
											{offer.description}
										</p>
										<div className="mb-4 flex items-end space-x-2">
											<span className="text-gray-400 line-through text-sm">
												₩{offer.regularPrice}
											</span>
											<span className="font-bold text-xl text-red-600">
												₩{offer.discountPrice}
											</span>
										</div>
										<div className="flex justify-between items-center">
											<span className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded-full">
												{offer.endDate}까지
											</span>
											<button className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
												지금 예약하기
												<ArrowRight className="ml-1.5 h-3.5 w-3.5" />
											</button>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* 시즌별 추천 패키지 섹션 */}
			<section className="py-20 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							시즌별 추천 패키지
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							계절마다 특별한 매력을 가진 여행지를 소개합니다.
						</p>
					</div>
					
					<div className="space-y-12">
						{seasonalPackages.map((season, index) => (
							<div key={season.title}>
								<div className="flex items-center mb-6">
									<h3 className="text-2xl font-bold text-neutral-800">{season.title}</h3>
									<div className={`ml-4 h-1 flex-grow ${
										index % 3 === 0 ? "bg-blue-500" : 
										index % 3 === 1 ? "bg-amber-500" : "bg-teal-500"
									} rounded-full`}></div>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{season.packages.map(pkg => (
										<Link href={`/packages/${pkg.id}`} key={pkg.id}>
											<div className="flex bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
												<div className="relative w-1/3 md:w-2/5">
													<Image
														src={pkg.image}
														alt={pkg.name}
														width={250}
														height={150}
														className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
														style={{ objectFit: "cover" }}
													/>
												</div>
												<div className="p-4 md:p-6 flex flex-col justify-between w-2/3 md:w-3/5">
													<div>
														<h4 className="font-bold text-lg md:text-xl text-neutral-900 group-hover:text-blue-600 transition-colors">
															{pkg.name}
														</h4>
														<div className="mt-2 md:mt-4 font-bold text-lg md:text-xl text-blue-600">
															₩{pkg.price}
														</div>
													</div>
													<div className="mt-4 flex justify-end">
														<button className="text-sm font-medium text-blue-600 flex items-center group-hover:text-blue-800 transition-colors">
															자세히 보기
															<ArrowRight className="h-3.5 w-3.5 ml-1" />
														</button>
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Us Section */}
			<section className="py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							왜 TripStore와 함께해야 할까요?
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-3xl mx-auto">
							단순한 여행이 아닌, 평생 기억에 남을 특별한 경험을 선사합니다.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
						{whyChooseUs.map((feature) => (
							<div
								key={feature.title}
								className="flex flex-col items-center p-8 rounded-2xl hover:bg-neutral-50 transition-all duration-300"
							>
								<div className="bg-blue-100 p-5 rounded-full mb-6 shadow-md">
									<feature.icon className="h-8 w-8 text-blue-600" />
								</div>
								<h3 className="text-xl font-bold text-neutral-900 mb-2">
									{feature.title}
								</h3>
								<p className="text-neutral-600">
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 고객 후기 섹션 */}
			<section className="py-20 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							고객 후기
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							TripStore와 함께한 고객들의 생생한 여행 후기를 확인하세요.
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{customerReviews.map((review) => (
							<div key={review.name} className="bg-white rounded-xl p-6 shadow-lifted">
								<div className="flex items-center mb-4">
									<div className="bg-blue-100 p-3 rounded-full flex items-center justify-center">
										<Star className="h-5 w-5 text-blue-600" />
									</div>
									<div className="ml-4">
										<h3 className="font-bold text-lg text-neutral-900">{review.name}</h3>
										<p className="text-sm text-neutral-500">{review.date}</p>
									</div>
								</div>
								
								<div className="mb-4">
									<div className="flex items-center mb-1">
										{[...Array(5)].map((_, i) => (
											<Star 
												key={i} 
												className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
												fill={i < review.rating ? 'currentColor' : 'none'} 
											/>
										))}
									</div>
									<p className="text-sm font-medium text-blue-600">{review.package}</p>
								</div>
								
								<p className="text-neutral-600 line-clamp-3">{review.comment}</p>
								
								<div className="mt-4 text-right">
									<button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
										후기 더 보기
									</button>
								</div>
							</div>
						))}
					</div>
					
					<div className="mt-10 text-center">
						<Link href="/reviews" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800">
							모든 후기 보기
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>

			{/* 여행 준비 팁 섹션 */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							현명한 여행을 위한 팁
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							완벽한 여행을 위한 TripStore의 전문가 팁을 확인하세요.
						</p>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{travelTips.map((tip) => (
							<div key={tip.title} className="bg-neutral-50 rounded-xl p-6 hover:shadow-md transition-all duration-300">
								<div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
									<tip.icon className="h-7 w-7 text-blue-600" />
								</div>
								<h3 className="font-bold text-xl mb-2 text-neutral-800">{tip.title}</h3>
								<p className="text-neutral-600">{tip.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ 섹션 */}
			<section className="py-20 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							자주 묻는 질문
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							여행 상품 예약 전 궁금하신 내용을 확인하세요.
						</p>
					</div>
					
					<div className="max-w-3xl mx-auto divide-y divide-neutral-200">
						{faqs.map((faq, index) => (
							<div key={index} className="py-6">
								<div className="flex items-start">
									<div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mr-4">
										<HelpCircle className="h-5 w-5 text-blue-600" />
									</div>
									<div>
										<h3 className="font-bold text-lg text-neutral-800 mb-2">{faq.question}</h3>
										<p className="text-neutral-600">{faq.answer}</p>
									</div>
								</div>
							</div>
						))}
					</div>
					
					<div className="text-center mt-8">
						<Link href="/notice" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition-colors">
							더 많은 질문 보기
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</div>
				</div>
			</section>



			{/* 뉴스레터 구독 섹션 */}
			<section className="py-20 bg-gradient-blue text-white relative overflow-hidden">
				<div className="absolute inset-0">
					<div className="absolute top-0 left-0 w-full h-full opacity-10">
						<div className="absolute top-10 right-10 w-72 h-72 rounded-full border-8 border-white/20"></div>
						<div className="absolute bottom-10 left-10 w-64 h-64 rounded-full border-8 border-white/20"></div>
						<div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full border-4 border-white/20"></div>
						<div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-full border-4 border-white/20"></div>
						<div className="absolute top-3/4 left-1/3 w-12 h-12 rounded-full bg-white/10"></div>
						<div className="absolute bottom-2/3 right-1/3 w-24 h-24 rounded-full bg-white/10"></div>
					</div>
				</div>
				
				<div className="container mx-auto px-4 relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl font-extrabold mb-6 tracking-tight">여행 정보와 특별 할인 소식 받기</h2>
						<p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
							새로운 여행지, 특별 할인 정보, 여행 팁을 가장 먼저 받아보세요.
							뉴스레터 구독자에게는 첫 예약 시 10% 추가 할인 혜택을 드립니다.
						</p>
						
						{isSubscribed ? (
							<div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl inline-block animate-fade-in shadow-lg">
								<div className="flex items-center justify-center">
									<div className="bg-green-500/20 p-4 rounded-full mr-5">
										<Send className="h-8 w-8 text-green-400" />
									</div>
									<div className="text-left">
										<h3 className="font-bold text-2xl mb-2">구독해주셔서 감사합니다!</h3>
										<p className="text-blue-100">곧 특별한 여행 소식을 보내드리겠습니다.</p>
									</div>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
								<input
									type="email"
									placeholder="이메일 주소 입력"
									className="flex-grow bg-white/10 backdrop-blur-sm border border-blue-400 text-white rounded-lg px-5 py-4 placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<button
									type="submit"
									className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-bold transition-colors flex-shrink-0 hover:shadow-lg"
								>
									구독하기
								</button>
							</form>
						)}
						
						<p className="text-xs text-blue-200 mt-5 max-w-lg mx-auto">
							구독은 언제든지 취소할 수 있으며, 개인정보는 뉴스레터 발송 목적으로만 사용됩니다.
							할인 혜택은 신규 고객에게만 적용됩니다.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
