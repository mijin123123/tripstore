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
		id: 6, // 실제 packagesData 아이디와 매칭
		name: "스위스 알프스 7일 완벽 일주",
		description: "융프라우와 마테호른의 절경",
		price: "3,500,000",
		image:
			"https://images.unsplash.com/photo-1539035104074-dee66086b5e3?q=80&w=2070&auto=format&fit=crop",
		rating: 4.9,
	},
	{
		id: 1, // 실제 packagesData의 파리 패키지 아이디
		name: "낭만의 도시, 파리 5일",
		description: "에펠탑, 루브르 박물관 핵심 코스",
		price: "2,800,000",
		image:
			"https://images.unsplash.com/photo-1502602898429-353d916e6251?q=80&w=2070&auto=format&fit=crop",
		rating: 4.8,
	},
	{
		id: 14, // 산토리니 패키지(임의의 고유 ID)
		name: "지중해의 보석, 산토리니",
		description: "푸른 바다와 하얀 건물의 조화",
		price: "4,200,000",
		image:
			"https://images.unsplash.com/photo-1533105079780-52b9be48d077?q=80&w=2070&auto=format&fit=crop",
		rating: 4.9,
	},
];

const whyChooseUs = [
	{
		icon: Award,
		title: "최고의 여행 전문가",
		description:
			"수년간의 경험을 가진 저희 전문가들이 완벽한 여행을 계획해 드립니다.",
	},
	{
		icon: ThumbsUp,
		title: "믿을 수 있는 서비스",
		description:
			"수천 개의 5성급 후기가 증명하는 고객 만족도를 자랑합니다.",
	},
	{
		icon: ShieldCheck,
		title: "안전한 예약 시스템",
		description:
			"고객님의 정보 보호를 최우선으로 생각하는 안전한 결제 시스템을 갖추고 있습니다.",
	},
];

// 인기 여행지 데이터
const popularDestinations = [
	{
		name: "파리",
		country: "프랑스",
		image: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=2070&auto=format&fit=crop",
		count: 26
	},
	{
		name: "로마",
		country: "이탈리아",
		image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2070&auto=format&fit=crop",
		count: 18
	},
	{
		name: "도쿄",
		country: "일본",
		image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1971&auto=format&fit=crop",
		count: 24
	},
	{
		name: "바르셀로나",
		country: "스페인",
		image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?q=80&w=2070&auto=format&fit=crop",
		count: 16
	},
	{
		name: "방콕",
		country: "태국",
		image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=2070&auto=format&fit=crop",
		count: 20
	},
	{
		name: "뉴욕",
		country: "미국",
		image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
		count: 32
	}
];

// 특별 할인 패키지
const specialOffers = [
	{
		id: 2, // 발리 패키지
		name: "발리 꿈의 휴양 6일",
		description: "완벽한 휴식을 위한 발리 리조트",
		regularPrice: "3,800,000",
		discountPrice: "2,850,000",
		discountRate: 25,
		image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop",
		endDate: "2025년 7월 15일",
	},
	{
		id: 5, // 로마 패키지
		name: "베트남 후에 & 다낭 5일",
		description: "역사와 해변의 완벽한 조화",
		regularPrice: "1,500,000",
		discountPrice: "1,125,000",
		discountRate: 25,
		image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=2070&auto=format&fit=crop",
		endDate: "2025년 7월 15일",
	},
	{
		id: 3, // 교토 패키지
		name: "후쿠오카 맛집 탐방 3일",
		description: "일본 최고의 음식 문화 체험",
		regularPrice: "1,200,000",
		discountPrice: "960,000",
		discountRate: 20,
		image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=2025&auto=format&fit=crop",
		endDate: "2025년 7월 20일",
	},
];

// 시즌별 추천 패키지
const seasonalPackages = [
	{
		title: "여름 휴가 베스트",
		packages: [
			{
				id: 7, // 그리스 산토리니 & 아테네 8일 패키지
				name: "그리스 산토리니 & 아테네 8일",
				price: "3,890,000",
				image: "https://images.unsplash.com/photo-1533105079780-52b9be48d077?q=80&w=2070&auto=format&fit=crop",
			},
			{
				id: 8,
				name: "하와이 오아후 & 마우이 7일",
				price: "4,290,000", 
				image: "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=2016&auto=format&fit=crop",
			},
		]
	},
	{
		title: "가을 단풍 여행",
		packages: [
			{
				id: 9,
				name: "캐나다 밴쿠버 & 로키 9일",
				price: "4,590,000",
				image: "https://images.unsplash.com/photo-1609825488888-3a928d3f0a54?q=80&w=2072&auto=format&fit=crop",
			},
			{
				id: 10, // 교토 단풍 명소 5일 패키지
				name: "교토 단풍 명소 5일",
				price: "1,990,000",
				image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop",
			},
		]
	},
	{
		title: "겨울 이색 체험",
		packages: [
			{
				id: 11,
				name: "핀란드 오로라 헌팅 6일",
				price: "3,490,000",
				image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=2070&auto=format&fit=crop",
			},
			{
				id: 12,
				name: "홋카이도 스키 & 온천 5일",
				price: "2,190,000",
				image: "https://images.unsplash.com/photo-1548092372-6d990a13f182?q=80&w=2070&auto=format&fit=crop",
			},
		]
	}
];

// 고객 후기 데이터
const customerReviews = [
	{
		name: "고객1",
		package: "그랜드 캐니언, 미국",
		rating: 5,
		comment: "웅장한 그랜드 캐니언의 경치에 압도되었습니다. 가이드님도 너무 친절하셨고, 일정도 여유있게 진행되어 정말 좋았어요. 특히 호텔이 모두 쾌적했습니다.",
		date: "2025년 6월 15일"
	},
	{
		name: "고객2",
		package: "파리 5일",
		rating: 4,
		comment: "파리 여행은 처음이었는데, 정말 로맨틱한 도시더라구요! 에펠탑, 루브르 박물관, 몽마르뜨 모두 좋았습니다. 다만 일정이 조금 빡빡한 점이 아쉬웠어요.",
		date: "2025년 5월 22일"
	},
	{
		name: "고객3",
		package: "발리 꿈의 휴양 6일",
		rating: 5,
		comment: "정말 완벽한 휴식이었습니다. 발리 리조트는 사진보다 더 멋졌고, 스파와 마사지 서비스도 만족스러웠어요. TripStore를 통해 예약해서 큰 할인도 받았습니다!",
		date: "2025년 6월 2일"
	}
];

// 여행 준비 팁 데이터
const travelTips = [
	{
		icon: Plane,
		title: "항공권 예약",
		description: "비수기에 예약하면 최대 30% 할인된 가격으로 항공권을 구매할 수 있습니다. 출발 2-3개월 전에 예약하는 것이 좋습니다."
	},
	{
		icon: Briefcase,
		title: "짐 꾸리기",
		description: "여행지 날씨를 미리 확인하고, 필수품 목록을 작성해 효율적으로 짐을 꾸리세요. 여권, 충전기, 상비약은 반드시 확인하세요."
	},
	{
		icon: Camera,
		title: "여행 계획",
		description: "너무 빡빡한 일정보다는 여유있게 계획하고, 현지에서만 경험할 수 있는 특별한 활동을 포함시키세요."
	},
	{
		icon: ShieldCheck,
		title: "여행 보험",
		description: "해외여행 시 예상치 못한 상황에 대비하여 여행자 보험에 가입하는 것이 좋습니다. 의료비용, 수하물 분실 등을 보장받을 수 있습니다."
	}
];

// FAQ 데이터
const faqs = [
	{
		question: "예약 취소는 언제까지 가능한가요?",
		answer: "일반적으로 출발 30일 전까지는 100% 환불, 15일 전까지는 70% 환불, 7일 전까지는 50% 환불이 가능합니다. 자세한 사항은 각 상품의 취소 규정을 확인해주세요."
	},
	{
		question: "여행 상품에 항공권이 포함되어 있나요?",
		answer: "대부분의 패키지 상품에는 왕복 항공권이 포함되어 있습니다. 상품 상세 페이지의 '포함 사항'에서 확인하실 수 있습니다."
	},
	{
		question: "비자 발급 서비스를 제공하나요?",
		answer: "네, 비자가 필요한 국가의 경우 별도 비용으로 비자 발급 대행 서비스를 제공하고 있습니다. 예약 시 추가 옵션으로 선택하실 수 있습니다."
	}
];



export default function Home() {
	const [destination, setDestination] = useState("");
	const [tripType, setTripType] = useState("모든 종류");
	const [email, setEmail] = useState("");
	const [isSubscribed, setIsSubscribed] = useState(false);
	const router = useRouter();

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (destination) {
			params.append("destination", destination);
		}
		if (tripType !== "모든 종류") {
			params.append("type", tripType);
		}
		router.push(`/packages?${params.toString()}`);
	};

	const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// 실제로는 API로 뉴스레터 구독 처리
		setIsSubscribed(true);
		setTimeout(() => {
			setIsSubscribed(false);
			setEmail("");
		}, 3000);
	};

	return (
		<main>
			{/* Hero Section */}
			<section className="relative h-[650px] flex items-center justify-center text-white">
				<div className="absolute inset-0">
					<Image
						src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
						alt="Hero background"
						layout="fill"
						objectFit="cover"
						className="image-filter-warm"
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
			<section className="-mt-24 relative z-20">
				<div className="container mx-auto px-4">
					<form
						onSubmit={handleSearch}
						className="glassmorphism p-8 rounded-2xl shadow-soft-2xl max-w-4xl mx-auto border border-white/20 animate-scale-in"
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
										layout="fill"
										objectFit="cover"
										className="transition-transform duration-700 group-hover:scale-110"
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
											layout="fill"
											objectFit="cover"
											className="transition-transform duration-700 group-hover:scale-110"
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
