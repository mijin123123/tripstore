import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Award,
  ThumbsUp,
  ShieldCheck,
  Calendar,
  Globe,
  Users,
  Mail,
  ArrowRight,
  Send,
  Plane,
  Briefcase,
  Camera,
  HelpCircle,
} from "lucide-react";

import { db } from "@/lib/neon";
import { packages as packagesSchema } from "@/lib/schema";
import SearchForm from "@/components/SearchForm";
import SubscriptionForm from "@/components/SubscriptionForm";
import { InferSelectModel } from "drizzle-orm";

type Package = InferSelectModel<typeof packagesSchema>;

// Helper function to format price
const formatPrice = (price: string | null) => {
  if (price === null) return "가격 문의";
  return new Intl.NumberFormat("ko-KR").format(Number(price));
};

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


export default async function Home() {
  let allPackages: Package[] = [];
  try {
    allPackages = await db.select().from(packagesSchema).orderBy(packagesSchema.createdAt);
  } catch (error) {
    console.error("Error fetching packages:", error);
    // 오류 발생 시 빈 배열을 사용하거나, 에러 페이지를 보여줄 수 있습니다.
  }

  // 추천 상품: isfeatured가 true인 상품, 없으면 최신 3개
  const featuredPackages = allPackages.filter(p => p.isfeatured).length > 0 
    ? allPackages.filter(p => p.isfeatured).slice(0, 3)
    : allPackages.slice(0, 3);

  // 시즌별 상품
  const seasonalPackagesData = allPackages.reduce((acc, pkg) => {
    if (pkg.season) {
      if (!acc[pkg.season]) {
        acc[pkg.season] = {
          title: `${pkg.season} 추천 여행`,
          packages: [],
        };
      }
      acc[pkg.season].packages.push(pkg);
    }
    return acc;
  }, {} as Record<string, { title: string; packages: Package[] }>);

  const seasonalPackages = Object.values(seasonalPackagesData);

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
          <SearchForm />
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
							<Link href={`/packages/${pkg.id}`} key={pkg.id} className="flex">
								<div 
									className="bg-white rounded-2xl shadow-lifted overflow-hidden transform transition-all duration-500 cursor-pointer hover:shadow-glow group flex flex-col w-full"
									style={{ animationDelay: `${index * 150}ms` }}
								>
									<div className="relative h-72 overflow-hidden">
										<div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-transparent z-10"></div>
										<Image
											src={pkg.images?.[0] || '/placeholder.jpg'}
											alt={pkg.title || 'Package image'}
											fill
											className="object-cover transition-transform duration-700 group-hover:scale-110"
											style={{ objectFit: "cover" }}
										/>
										<div className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-md text-neutral-800 px-3 py-1.5 rounded-full text-sm font-bold flex items-center shadow-subtle">
											<Star className="h-4 w-4 text-yellow-500 mr-1.5" fill="currentColor" />
											{pkg.rating}
										</div>
									</div>
									<div className="p-7 flex flex-col flex-grow">
										<h3 className="font-bold text-2xl mb-2 text-neutral-900 group-hover:text-blue-600 transition-colors">
											{pkg.title}
										</h3>
										<p className="text-neutral-600 mb-5">
											{pkg.description}
										</p>
										<div className="flex justify-between items-center mt-auto">
											<div className="text-right font-extrabold text-2xl text-blue-600">
												₩{formatPrice(pkg.price)}
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
								
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
									{season.packages.map((pkg: Package) => (
										<Link href={`/packages/${pkg.id}`} key={pkg.id} className="flex">
											<div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group flex flex-col w-full">
												<div className="relative h-48">
													<Image
														src={pkg.images?.[0] || '/placeholder.jpg'}
														alt={pkg.title || 'Package image'}
														fill
														className="object-cover"
														style={{ objectFit: "cover" }}
													/>
												</div>
												<div className="p-5 flex flex-col flex-grow">
													<h4 className="font-bold text-lg text-neutral-800 truncate group-hover:text-blue-600 transition-colors">
														{pkg.title}
													</h4>
													<p className="text-sm text-neutral-500 mt-1 mb-3 flex-grow">
														{pkg.description}
													</p>
													<div className="flex justify-between items-center mt-auto">
														<div className="font-bold text-lg text-blue-600">
															₩{formatPrice(pkg.price)}
														</div>
														<span className="text-xs text-neutral-500 flex items-center">
															<Star className="h-3 w-3 text-yellow-400 mr-1" fill="currentColor" /> {pkg.rating}
														</span>
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
							왜 TripStore를 선택해야 할까요?
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							최고의 여행 경험을 위한 TripStore의 약속
						</p>
						<div className="w-20 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
						{whyChooseUs.map((item, index) => (
							<div key={index} className="p-8 bg-neutral-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
								<div className="inline-block p-4 bg-blue-100 text-blue-600 rounded-full mb-5">
									<item.icon className="h-8 w-8" />
								</div>
								<h3 className="text-xl font-bold text-neutral-800 mb-3">{item.title}</h3>
								<p className="text-neutral-600">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Customer Reviews Section */}
			<section className="py-24 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							생생한 고객 후기
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							TripStore와 함께한 고객님들의 소중한 경험을 확인해보세요.
						</p>
						<div className="w-20 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{customerReviews.map((review, index) => (
							<div key={index} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col">
								<div className="flex items-center mb-4">
									<div className="flex text-yellow-400">
										{[...Array(review.rating)].map((_, i) => (
											<Star key={i} className="h-5 w-5" fill="currentColor" />
										))}
										{[...Array(5 - review.rating)].map((_, i) => (
											<Star key={i} className="h-5 w-5 text-neutral-300" />
										))}
									</div>
								</div>
								<p className="text-neutral-600 mb-5 flex-grow">"{review.comment}"</p>
								<div className="mt-auto pt-4 border-t border-neutral-100">
									<p className="font-bold text-neutral-800">{review.name}</p>
									<p className="text-sm text-neutral-500">{review.package}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Travel Tips Section */}
			<section className="py-24 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							슬기로운 여행 팁
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							여행 전문가가 알려주는 유용한 정보로 여행을 더 완벽하게 준비하세요.
						</p>
						<div className="w-20 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{travelTips.map((tip, index) => (
							<div key={index} className="bg-neutral-50 p-6 rounded-xl text-center hover:bg-blue-50 transition-colors">
								<div className="inline-block p-3 bg-white text-blue-600 rounded-full mb-4 shadow-sm">
									<tip.icon className="h-7 w-7" />
								</div>
								<h3 className="font-bold text-lg text-neutral-800 mb-2">{tip.title}</h3>
								<p className="text-sm text-neutral-600">{tip.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-24 bg-neutral-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-extrabold text-neutral-800 tracking-tight">
							자주 묻는 질문
						</h2>
						<p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
							궁금한 점이 있으신가요? 먼저 확인해보세요.
						</p>
						<div className="w-20 h-1.5 bg-blue-500 mx-auto mt-6 rounded-full"></div>
					</div>
					<div className="max-w-3xl mx-auto">
						<div className="space-y-4">
							{faqs.map((faq, index) => (
								<details key={index} className="group bg-white p-6 rounded-lg shadow-sm cursor-pointer">
									<summary className="flex justify-between items-center font-semibold text-lg text-neutral-800">
										{faq.question}
										<HelpCircle className="h-5 w-5 text-neutral-400 group-open:rotate-180 transition-transform" />
									</summary>
									<p className="mt-4 text-neutral-600">
										{faq.answer}
									</p>
								</details>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Subscription Section */}
			<SubscriptionForm />

		</main>
  );
}
