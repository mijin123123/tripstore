const { Pool } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

// 메인페이지의 모든 패키지 데이터
const mainPagePackages = [
  // 추천 패키지 (featuredPackages)
  {
    title: '발리 럭셔리 빌라 휴양',
    description: '프라이빗 풀장이 있는 럭셔리 빌라에서 완벽한 휴식을 즐기세요. 발리의 아름다운 자연과 전통 문화를 만끽하며 진정한 힐링을 경험하세요.',
    destination: '발리, 인도네시아',
    price: 1990000,
    discountprice: 1690000,
    duration: '4박 5일',
    departuredate: ['2025-08-01', '2025-08-15', '2025-09-01', '2025-09-15', '2025-10-01'],
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1740', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1740', 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?q=80&w=1740'],
    rating: 4.9,
    reviewcount: 127,
    category: '휴양지',
    season: '여름',
    inclusions: ['항공료', '럭셔리 빌라 숙박', '조식', '공항 픽업', '프라이빗 풀장', '스파 체험'],
    exclusions: ['점심/저녁', '개인 경비', '여행자 보험'],
    isfeatured: true,
    isonsale: true,
    itinerary: {
      "1일차": "인천-발리 출발, 빌라 체크인",
      "2일차": "우붓 투어, 전통 시장 방문",
      "3일차": "해변 휴식, 스파 체험",
      "4일차": "탄중 베노아 투어",
      "5일차": "발리-인천 출발"
    }
  },
  {
    title: '도쿄 문화 탐방',
    description: '현대적인 도시와 전통이 공존하는 도쿄의 문화를 경험하세요. 역사 깊은 사찰부터 최신 트렌드까지 도쿄의 모든 매력을 발견해보세요.',
    destination: '도쿄, 일본',
    price: 1290000,
    discountprice: 1090000,
    duration: '3박 4일',
    departuredate: ['2025-08-10', '2025-08-24', '2025-09-07', '2025-09-21', '2025-10-05'],
    images: ['https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1753', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1740', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1740'],
    rating: 4.8,
    reviewcount: 89,
    category: '문화체험',
    season: '여름',
    inclusions: ['항공료', '4성급 호텔', '조식', '가이드 투어', '문화체험', 'JR패스'],
    exclusions: ['점심/저녁', '개인 경비', '쇼핑비'],
    isfeatured: true,
    isonsale: false,
    itinerary: {
      "1일차": "인천-도쿄 출발, 아사쿠사 투어",
      "2일차": "시부야, 하라주쿠 투어",
      "3일차": "전통 다도 체험, 스시 만들기",
      "4일차": "도쿄-인천 출발"
    }
  },
  {
    title: '파리 로맨틱 투어',
    description: '세계에서 가장 낭만적인 도시에서 특별한 추억을 만들어보세요. 에펠탑, 루브르 박물관, 세느강 크루즈까지 파리의 모든 로맨스를 경험하세요.',
    destination: '파리, 프랑스',
    price: 2390000,
    discountprice: 2090000,
    duration: '5박 6일',
    departuredate: ['2025-08-05', '2025-08-19', '2025-09-02', '2025-09-16', '2025-10-07'],
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1742', 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?q=80&w=1740', 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?q=80&w=1740'],
    rating: 4.7,
    reviewcount: 156,
    category: '로맨스',
    season: '여름',
    inclusions: ['항공료', '4성급 호텔', '조식', '세느강 크루즈', '루브르 박물관 입장권', '와인 테이스팅'],
    exclusions: ['점심/저녁', '개인 경비', '쇼핑비'],
    isfeatured: true,
    isonsale: true,
    itinerary: {
      "1일차": "인천-파리 출발",
      "2일차": "에펠탑, 샹젤리제 거리",
      "3일차": "루브르 박물관, 노트르담",
      "4일차": "베르사유 궁전",
      "5일차": "몽마르트, 세느강 크루즈",
      "6일차": "파리-인천 출발"
    }
  },

  // 특별 할인 상품 (specialOffers)
  {
    title: '제주 힐링 3일',
    description: '에메랄드 빛 바다와 청정 자연을 만끽하는 제주도 힐링 여행. 일상의 스트레스를 잊고 제주의 아름다운 자연 속에서 진정한 휴식을 찾으세요.',
    destination: '제주도, 한국',
    price: 890000,
    discountprice: 599000,
    duration: '2박 3일',
    departuredate: ['2025-07-20', '2025-08-03', '2025-08-17', '2025-08-31', '2025-09-14'],
    images: ['https://images.unsplash.com/photo-1561424111-c47df0f91351?q=80&w=1726', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1740'],
    rating: 4.6,
    reviewcount: 234,
    category: '국내여행',
    season: '여름',
    inclusions: ['항공료', '리조트 숙박', '조식', '렌터카', '성산일출봉 입장권', '한라산 트레킹'],
    exclusions: ['점심/저녁', '개인 경비', '유류비'],
    isfeatured: false,
    isonsale: true,
    itinerary: {
      "1일차": "김포-제주 출발, 성산일출봉",
      "2일차": "한라산 트레킹, 협재해수욕장",
      "3일차": "제주-김포 출발"
    }
  },
  {
    title: '교토 단풍 특집',
    description: '가을의 정취가 물든 교토의 사찰과 정원 순례. 천년 고도 교토의 아름다운 단풍과 전통문화를 동시에 만끽할 수 있는 특별한 여행입니다.',
    destination: '교토, 일본',
    price: 1290000,
    discountprice: 990000,
    duration: '3박 4일',
    departuredate: ['2025-10-15', '2025-10-29', '2025-11-12', '2025-11-26'],
    images: ['https://images.unsplash.com/photo-1558862107-d49ef2a04d72?q=80&w=1740', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1740', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1740'],
    rating: 4.8,
    reviewcount: 167,
    category: '문화체험',
    season: '가을',
    inclusions: ['항공료', '료칸 숙박', '조식', '가이드 투어', '사찰 입장권', '다도 체험'],
    exclusions: ['점심/저녁', '개인 경비', '쇼핑비'],
    isfeatured: false,
    isonsale: true,
    itinerary: {
      "1일차": "인천-오사카-교토",
      "2일차": "기요미즈데라, 기온 거리",
      "3일차": "후시미 이나리, 아라시야마",
      "4일차": "교토-오사카-인천 출발"
    }
  },
  {
    title: '다낭 골프 패키지',
    description: '해변과 골프를 동시에 즐기는 프리미엄 다낭 골프 여행. 세계적 수준의 골프장에서 라운딩을 즐기고 베트남의 아름다운 해변에서 휴식을 취하세요.',
    destination: '다낭, 베트남',
    price: 1590000,
    discountprice: 1190000,
    duration: '4박 5일',
    departuredate: ['2025-08-12', '2025-08-26', '2025-09-09', '2025-09-23'],
    images: ['https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1750', 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=1740', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1740'],
    rating: 4.5,
    reviewcount: 98,
    category: '스포츠',
    season: '여름',
    inclusions: ['항공료', '리조트 숙박', '조식', '골프 2라운드', '캐디피', '스파 체험'],
    exclusions: ['점심/저녁', '개인 경비', '골프 용품'],
    isfeatured: false,
    isonsale: true,
    itinerary: {
      "1일차": "인천-다낭 출발",
      "2일차": "골프 1라운드, 해변 휴식",
      "3일차": "시내 투어, 스파",
      "4일차": "골프 2라운드",
      "5일차": "다낭-인천 출발"
    }
  },

  // 시즌별 추천 패키지 (seasonalPackages)
  // 여름 추천
  {
    title: '몰디브 여름 에디션',
    description: '크리스탈 블루 바다와 백사장이 펼쳐진 몰디브에서 완벽한 여름휴가를 보내세요. 수상 빌라에서의 럭셔리한 휴식과 다양한 해양 액티비티를 즐길 수 있습니다.',
    destination: '몰디브',
    price: 2890000,
    discountprice: 2590000,
    duration: '5박 6일',
    departuredate: ['2025-07-01', '2025-07-15', '2025-08-01', '2025-08-15'],
    images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1365', 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1740', 'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?q=80&w=1740'],
    rating: 4.9,
    reviewcount: 89,
    category: '휴양지',
    season: '여름',
    inclusions: ['항공료', '수상빌라 숙박', '올인클루시브', '스노클링', '선셋 크루즈', '스파'],
    exclusions: ['개인 경비', '알코올', '추가 액티비티'],
    isfeatured: false,
    isonsale: false,
    itinerary: {
      "1일차": "인천-말레 출발, 수상빌라 체크인",
      "2일차": "스노클링, 해양 스포츠",
      "3일차": "선셋 크루즈, 스파",
      "4일차": "무인도 투어",
      "5일차": "자유시간, 쇼핑",
      "6일차": "말레-인천 출발"
    }
  },
  {
    title: '하와이 비치 패키지',
    description: '태평양의 진주 하와이에서 완벽한 비치 휴가를 즐기세요. 와이키키 해변의 서핑부터 진주만 역사 투어까지 하와이의 모든 매력을 경험해보세요.',
    destination: '하와이, 미국',
    price: 3190000,
    discountprice: 2890000,
    duration: '5박 7일',
    departuredate: ['2025-07-10', '2025-07-24', '2025-08-07', '2025-08-21'],
    images: ['https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=1374', 'https://images.unsplash.com/photo-1562525659-48d31b2b1414?q=80&w=1740', 'https://images.unsplash.com/photo-1598135753163-6167c1a1ad65?q=80&w=1740'],
    rating: 4.8,
    reviewcount: 156,
    category: '휴양지',
    season: '여름',
    inclusions: ['항공료', '리조트 숙박', '조식', '진주만 투어', '서핑 레슨', '폴리네시안 쇼'],
    exclusions: ['점심/저녁', '개인 경비', '추가 투어'],
    isfeatured: false,
    isonsale: false,
    itinerary: {
      "1일차": "인천-호놀룰루 출발",
      "2일차": "와이키키 해변, 다이아몬드 헤드",
      "3일차": "진주만 투어",
      "4일차": "서핑 레슨, 쇼핑",
      "5일차": "자유시간",
      "6일차": "폴리네시안 쇼",
      "7일차": "호놀룰루-인천 출발"
    }
  },

  // 가을 추천
  {
    title: '유럽 가을 낭만',
    description: '가을빛으로 물든 유럽의 아름다운 도시들을 둘러보세요. 프라하, 빈, 부다페스트의 황금빛 단풍과 클래식한 건축물이 만들어내는 환상적인 풍경을 만끽하세요.',
    destination: '프라하-빈-부다페스트',
    price: 2790000,
    discountprice: 2490000,
    duration: '7박 8일',
    departuredate: ['2025-09-15', '2025-10-01', '2025-10-15', '2025-10-29'],
    images: ['https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1740', 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=1740', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1740'],
    rating: 4.7,
    reviewcount: 234,
    category: '문화체험',
    season: '가을',
    inclusions: ['항공료', '4성급 호텔', '조식', '가이드 투어', '입장료', '시내교통'],
    exclusions: ['점심/저녁', '개인 경비', '선택관광'],
    isfeatured: false,
    isonsale: false,
    itinerary: {
      "1일차": "인천-프라하 출발",
      "2일차": "프라하 구시가지, 카를교",
      "3일차": "프라하성, 빈 이동",
      "4일차": "빈 시내 투어, 쇤브룬 궁전",
      "5일차": "빈-부다페스트 이동",
      "6일차": "부다페스트 시내 투어",
      "7일차": "도나우강 크루즈",
      "8일차": "부다페스트-인천 출발"
    }
  },
  {
    title: '한국의 가을',
    description: '우리나라 가을의 정취를 만끽할 수 있는 특별한 국내 여행. 설악산의 단풍, 경주의 고즈넉한 사찰, 전주의 한옥마을까지 한국의 아름다운 가을을 느껴보세요.',
    destination: '설악산-경주-전주',
    price: 690000,
    discountprice: 590000,
    duration: '3박 4일',
    departuredate: ['2025-09-20', '2025-10-05', '2025-10-20', '2025-11-05'],
    images: ['https://images.unsplash.com/photo-1604430352727-c0cd66be47aa?q=80&w=1770', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1740', 'https://images.unsplash.com/photo-1578047254294-89aa4fe79b0a?q=80&w=1740'],
    rating: 4.6,
    reviewcount: 187,
    category: '국내여행',
    season: '가을',
    inclusions: ['교통비', '숙박비', '조식', '가이드', '입장료', '한복체험'],
    exclusions: ['점심/저녁', '개인 경비'],
    isfeatured: false,
    isonsale: false,
    itinerary: {
      "1일차": "서울-설악산, 단풍 트레킹",
      "2일차": "설악산-경주, 불국사",
      "3일차": "경주-전주, 한옥마을",
      "4일차": "전주-서울 출발"
    }
  },

  // 겨울 추천
  {
    title: '스위스 스키 여행',
    description: '알프스의 눈 덮인 봉우리들 사이에서 최고의 스키를 즐기세요. 체르마트와 인터라켄에서 스키와 함께 스위스의 아름다운 겨울 풍경을 만끽하는 특별한 여행입니다.',
    destination: '체르마트-인터라켄, 스위스',
    price: 3290000,
    discountprice: 2990000,
    duration: '6박 7일',
    departuredate: ['2025-12-15', '2025-12-29', '2026-01-12', '2026-01-26'],
    images: ['https://images.unsplash.com/photo-1551867633-194f125bddfa?q=80&w=1740', 'https://images.unsplash.com/photo-1578936044334-45dbdbb2c0e4?q=80&w=1740', 'https://images.unsplash.com/photo-1465846815386-a23b8bb23adb?q=80&w=1740'],
    rating: 4.8,
    reviewcount: 123,
    category: '스포츠',
    season: '겨울',
    inclusions: ['항공료', '산장 숙박', '조식', '스키패스', '장비렌탈', '케이블카'],
    exclusions: ['점심/저녁', '개인 경비', '스키레슨'],
    isfeatured: false,
    isonsale: false,
    itinerary: {
      "1일차": "인천-취리히-체르마트",
      "2일차": "마터호른 구경, 스키",
      "3일차": "스키, 체르마트 마을 투어",
      "4일차": "체르마트-인터라켄",
      "5일차": "융프라우 투어",
      "6일차": "스키, 자유시간",
      "7일차": "인터라켄-취리히-인천 출발"
    }
  },
  {
    title: '일본 온천 여행',
    description: '눈 내리는 겨울, 일본의 따뜻한 온천에서 몸과 마음을 힐링하세요. 하코네와 아타미의 노천온천에서 후지산을 바라보며 특별한 겨울 휴가를 보내세요.',
    destination: '하코네-아타미, 일본',
    price: 1690000,
    discountprice: 1490000,
    duration: '3박 4일',
    departuredate: ['2025-12-20', '2026-01-03', '2026-01-17', '2026-01-31'],
    images: ['https://images.unsplash.com/photo-1493514789931-586cb221d7a7?q=80&w=1741', 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?q=80&w=1740', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=1740'],
    rating: 4.7,
    reviewcount: 198,
    category: '휴양지',
    season: '겨울',
    inclusions: ['항공료', '료칸 숙박', '조식/석식', '온천 이용', '후지산 투어', '전통체험'],
    exclusions: ['점심', '개인 경비', '추가 마사지'],
    isfeatured: false,
    isonsale: false,
    itinerary: {
      "1일차": "인천-도쿄-하코네",
      "2일차": "하코네 온천, 후지산 구경",
      "3일차": "하코네-아타미, 온천",
      "4일차": "아타미-도쿄-인천 출발"
    }
  }
];

async function addMainPagePackages() {
  try {
    console.log('🚀 메인페이지 패키지 데이터베이스 추가 시작...');
    
    if (!process.env.NEON_DATABASE_URL) {
      console.error('❌ NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return;
    }

    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    console.log('📝 패키지 추가 중...');
    
    let addedCount = 0;
    let skippedCount = 0;
    
    for (const pkg of mainPagePackages) {
      // 제목으로 중복 확인 (id는 자동 생성되므로)
      const existingPackage = await pool.query(
        'SELECT id FROM packages WHERE title = $1',
        [pkg.title]
      );
      
      if (existingPackage.rows.length > 0) {
        console.log(`⚠️  패키지 "${pkg.title}"는 이미 존재합니다. 건너뜀.`);
        skippedCount++;
        continue;
      }
      
      // 패키지 추가 (id는 자동 생성, UUID 사용)
      await pool.query(`
        INSERT INTO packages (
          title, description, destination, price, discountprice,
          duration, departuredate, images, rating, reviewcount,
          category, season, inclusions, exclusions, isfeatured,
          isonsale, itinerary, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, now(), now()
        )
      `, [
        pkg.title,
        pkg.description,
        pkg.destination,
        pkg.price,
        pkg.discountprice,
        pkg.duration,
        pkg.departuredate,
        pkg.images,
        pkg.rating,
        pkg.reviewcount,
        pkg.category,
        pkg.season,
        pkg.inclusions,
        pkg.exclusions,
        pkg.isfeatured,
        pkg.isonsale,
        JSON.stringify(pkg.itinerary)
      ]);
      
      console.log(`✅ 패키지 "${pkg.title}" 추가 완료`);
      addedCount++;
    }
    
    console.log('\n🎉 메인페이지 패키지 추가 완료!');
    console.log(`📊 추가된 패키지: ${addedCount}개`);
    console.log(`⚠️  건너뛴 패키지: ${skippedCount}개`);
    
    // 추가된 패키지 개수 확인
    const totalCount = await pool.query('SELECT COUNT(*) as count FROM packages');
    console.log(`📊 총 패키지 개수: ${totalCount.rows[0].count}개`);
    
    // 패키지 타입별 개수 확인
    const featuredCount = await pool.query('SELECT COUNT(*) as count FROM packages WHERE isfeatured = true');
    const onSaleCount = await pool.query('SELECT COUNT(*) as count FROM packages WHERE isonsale = true');
    
    console.log(`🌟 추천 패키지: ${featuredCount.rows[0].count}개`);
    console.log(`🏷️  할인 패키지: ${onSaleCount.rows[0].count}개`);
    
  } catch (error) {
    console.error('❌ 패키지 추가 중 오류:', error);
  }
}

addMainPagePackages();
