-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name, parent_id)
);

-- 패키지 테이블 생성
CREATE TABLE IF NOT EXISTS packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  destination VARCHAR(255) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  duration INTEGER NOT NULL,
  price INTEGER NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE NOT NULL,
  max_people INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  image_url TEXT,
  includes TEXT[] NOT NULL DEFAULT '{}',
  excludes TEXT[] NOT NULL DEFAULT '{}',
  itinerary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- 예약 테이블 생성
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  traveler_count INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  traveler_details JSONB NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 리뷰 테이블 생성
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 기존 데이터 삭제 (새로운 구조로 변경하기 위해)
DELETE FROM reviews;
DELETE FROM bookings;
DELETE FROM packages;
DELETE FROM categories;

-- 메인 카테고리 삽입 (parent_id가 NULL인 최상위 카테고리)
INSERT INTO categories (name, description, image_url, sort_order, parent_id) VALUES 
('해외여행', '해외 여행 상품 전체', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 1, NULL),
('국내', '국내 여행 상품', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 2, NULL),
('호텔', '숙박 상품', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 3, NULL),
('하이클래스', '프리미엄 여행 상품', 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800', 4, NULL);

-- 해외여행 하위 카테고리 삽입
INSERT INTO categories (name, description, image_url, sort_order, parent_id) VALUES 
('유럽', '프랑스, 이탈리아, 독일, 스페인 등', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800', 1, (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
('동남아', '태국, 베트남, 싱가포르, 말레이시아 등', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 2, (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
('일본', '도쿄, 오사카, 교토 등 일본 전지역', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800', 3, (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
('중국', '베이징, 상하이, 시안 등 중국 전지역', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 4, (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
('미주/하와이/중남미', '미국, 캐나다, 하와이, 브라질 등', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 5, (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
('골프', '해외 골프 여행 상품', 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800', 6, (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL));

-- 국내 하위 카테고리 삽입
INSERT INTO categories (name, description, image_url, sort_order, parent_id) VALUES 
('호텔', '국내 호텔 상품', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 1, (SELECT id FROM categories WHERE name = '국내' AND parent_id IS NULL)),
('리조트', '국내 리조트 상품', 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800', 2, (SELECT id FROM categories WHERE name = '국내' AND parent_id IS NULL)),
('풀빌라', '국내 풀빌라 상품', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 3, (SELECT id FROM categories WHERE name = '국내' AND parent_id IS NULL));

-- 호텔 하위 카테고리 삽입
INSERT INTO categories (name, description, image_url, sort_order, parent_id) VALUES 
('유럽', '유럽 지역 호텔', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800', 1, (SELECT id FROM categories WHERE name = '호텔' AND parent_id IS NULL)),
('동남아', '동남아 지역 호텔', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', 2, (SELECT id FROM categories WHERE name = '호텔' AND parent_id IS NULL)),
('일본', '일본 지역 호텔', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800', 3, (SELECT id FROM categories WHERE name = '호텔' AND parent_id IS NULL)),
('중국', '중국 지역 호텔', 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800', 4, (SELECT id FROM categories WHERE name = '호텔' AND parent_id IS NULL)),
('미주/하와이/중남미', '미주/하와이/중남미 지역 호텔', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 5, (SELECT id FROM categories WHERE name = '호텔' AND parent_id IS NULL));

-- 하이클래스 하위 카테고리 삽입
INSERT INTO categories (name, description, image_url, sort_order, parent_id) VALUES 
('유럽', '유럽 하이클래스 여행', 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800', 1, (SELECT id FROM categories WHERE name = '하이클래스' AND parent_id IS NULL)),
('크루즈', '럭셔리 크루즈 여행', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800', 2, (SELECT id FROM categories WHERE name = '하이클래스' AND parent_id IS NULL)),
('일본', '일본 하이클래스 여행', 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800', 3, (SELECT id FROM categories WHERE name = '하이클래스' AND parent_id IS NULL)),
('이색테마', '특별한 테마 여행', 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800', 4, (SELECT id FROM categories WHERE name = '하이클래스' AND parent_id IS NULL)),
('럭셔리 에어텔', '럭셔리 항공 및 호텔 패키지', 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 5, (SELECT id FROM categories WHERE name = '하이클래스' AND parent_id IS NULL));

-- 샘플 패키지 데이터 삽입
INSERT INTO packages (
  title, 
  description, 
  destination,
  category_id,
  duration, 
  price, 
  departure_date, 
  return_date, 
  max_people, 
  current_bookings,
  image_url,
  includes, 
  excludes, 
  itinerary
) VALUES 
-- 동남아 패키지
(
  '방콕 & 파타야 힐링 여행 6일',
  '태국의 매력적인 두 도시 방콕과 파타야에서 휴식과 관광을 동시에 즐길 수 있는 완벽한 패키지입니다.',
  '태국 방콕/파타야',
  (SELECT id FROM categories WHERE name = '동남아' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  6,
  980000,
  '2025-09-15',
  '2025-09-20',
  25,
  8,
  'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 5박', '전문 가이드', '조식 5회', '공항 픽업/샌딩', '시내 관광'],
  ARRAY['점심/저녁 식사', '개인 경비', '마사지', '선택 관광'],
  E'1일차: 인천공항 출발 → 수완나품공항 도착 → 방콕 시내 관광\n2일차: 왕궁 → 왓포 사원 → 차오프라야 강 투어\n3일차: 방콕 → 파타야 이동 → 비치 휴식\n4일차: 코랄섬 투어 → 워킹스트리트\n5일차: 파타야 → 방콕 이동 → 쇼핑\n6일차: 자유시간 → 수완나품공항 출발 → 인천공항 도착'
),
(
  '베트남 다낭 골프 & 리조트 5일',
  '베트남 다낭의 아름다운 해변과 세계적인 골프장에서 즐기는 럭셔리 휴양 여행입니다.',
  '베트남 다낭',
  (SELECT id FROM categories WHERE name = '동남아' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  5,
  1500000,
  '2025-10-10',
  '2025-10-14',
  15,
  3,
  'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800',
  ARRAY['왕복 항공료', '5성급 리조트 4박', '골프 2라운드', '전문 가이드', '조식 4회'],
  ARRAY['점심/저녁 식사', '골프 카트비', '개인 경비', '추가 골프'],
  E'1일차: 인천공항 출발 → 다낭공항 도착 → 리조트 체크인\n2일차: 바나힐 투어 → 골든브릿지\n3일차: 골프 1라운드 → 해변 휴식\n4일차: 호이안 고대도시 투어 → 골프 1라운드\n5일차: 자유시간 → 다낭공항 출발 → 인천공항 도착'
),
(
  '싱가포르 시티 투어 4일',
  '동남아시아의 진주 싱가포르에서 현대적인 도시의 매력과 다양한 문화를 체험하는 여행입니다.',
  '싱가포르',
  (SELECT id FROM categories WHERE name = '동남아' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  4,
  1350000,
  '2025-08-25',
  '2025-08-28',
  18,
  12,
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 3박', '전문 가이드', '조식 3회', '시내 관광'],
  ARRAY['점심/저녁 식사', '개인 경비', 'USS 입장료', '선택 관광'],
  E'1일차: 인천공항 출발 → 창이공항 도착 → 시내 관광\n2일차: 센토사섬 → 머라이언 파크 → 마리나베이샌즈\n3일차: 유니버설 스튜디오 → 시내 쇼핑\n4일차: 자유시간 → 창이공항 출발 → 인천공항 도착'
),
(
  '필리핀 세부 힐링 리조트 5일',
  '필리핀 세부의 푸른 바다와 하얀 모래사장에서 진정한 휴식을 즐기는 힐링 여행입니다.',
  '필리핀 세부',
  (SELECT id FROM categories WHERE name = '동남아' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  5,
  1180000,
  '2025-11-05',
  '2025-11-09',
  20,
  5,
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
  ARRAY['왕복 항공료', '5성급 리조트 4박', '공항 픽업/샌딩', '조식 4회', '스파 1회'],
  ARRAY['점심/저녁 식사', '개인 경비', '선택 관광', '액티비티'],
  E'1일차: 인천공항 출발 → 세부공항 도착 → 리조트 체크인\n2일차: 아일랜드 호핑 투어 → 스노클링\n3일차: 보홀섬 투어 → 초콜릿힐\n4일차: 스파 & 리조트 휴식 → 해변 액티비티\n5일차: 자유시간 → 세부공항 출발 → 인천공항 도착'
),

-- 유럽 패키지
(
  '유럽 3개국 투어 10일',
  '프랑스, 이탈리아, 스위스 3개국을 둘러보는 유럽의 정수를 만끽하는 클래식 투어입니다.',
  '프랑스/이탈리아/스위스',
  (SELECT id FROM categories WHERE name = '유럽' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  10,
  3500000,
  '2025-09-01',
  '2025-09-10',
  30,
  15,
  'https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 9박', '전문 가이드', '조식 9회', '시내 관광', '고속철도'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '팁'],
  E'1일차: 인천공항 출발 → 파리 도착\n2일차: 파리 시내 관광 (에펠탑, 루브르박물관)\n3일차: 베르사유 궁전 → 파리 자유시간\n4일차: 파리 → 로마 이동\n5일차: 로마 시내 관광 (콜로세움, 바티칸)\n6일차: 로마 → 피렌체 → 베니스\n7일차: 베니스 → 밀라노 → 스위스\n8일차: 융프라우 관광\n9일차: 스위스 → 파리 이동\n10일차: 파리 출발 → 인천공항 도착'
),
(
  '스페인 & 포르투갈 여행 8일',
  '이베리아 반도의 정열적인 문화와 아름다운 건축물을 만나는 특별한 여행입니다.',
  '스페인/포르투갈',
  (SELECT id FROM categories WHERE name = '유럽' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  8,
  2800000,
  '2025-10-15',
  '2025-10-22',
  25,
  8,
  'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 7박', '전문 가이드', '조식 7회', '시내 관광'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '플라멩코 쇼'],
  E'1일차: 인천공항 출발 → 마드리드 도착\n2일차: 마드리드 시내 관광 → 프라도 미술관\n3일차: 마드리드 → 세비야 → 그라나다\n4일차: 알함브라 궁전 → 바르셀로나 이동\n5일차: 바르셀로나 관광 → 가우디 건축물\n6일차: 바르셀로나 → 리스본 이동\n7일차: 리스본 & 포르투 관광\n8일차: 리스본 출발 → 인천공항 도착'
),
(
  '독일 로맨틱 가도 여행 7일',
  '독일의 아름다운 중세 마을들과 노이슈반슈타인 성을 둘러보는 로맨틱한 여행입니다.',
  '독일',
  (SELECT id FROM categories WHERE name = '유럽' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  7,
  2400000,
  '2025-08-20',
  '2025-08-26',
  20,
  6,
  'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 6박', '전문 가이드', '조식 6회', '시내 관광'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '맥주 체험'],
  E'1일차: 인천공항 출발 → 뮌헨 도착\n2일차: 뮌헨 시내 관광 → 맥주 홀 체험\n3일차: 노이슈반슈타인 성 → 로텐부르크\n4일차: 로맨틱 가도 투어 → 하이델베르크\n5일차: 하이델베르크 → 쾰른 대성당\n6일차: 베를린 관광 → 브란덴부르크 문\n7일차: 베를린 출발 → 인천공항 도착'
),

-- 일본 패키지
(
  '도쿄 벚꽃 여행 5일',
  '일본 도쿄의 아름다운 벚꽃을 만끽할 수 있는 특별한 여행입니다. 우에노 공원, 치도리가후치, 신주쿠 교엔 등 도쿄 최고의 벚꽃 명소를 방문합니다.',
  '일본 도쿄',
  (SELECT id FROM categories WHERE name = '일본' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  5,
  1200000,
  '2026-04-01',
  '2026-04-05',
  20,
  5,
  'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 4박', '전문 가이드', '조식 4회', '공항 픽업/샌딩'],
  ARRAY['점심/저녁 식사', '개인 경비', '여행자 보험', '선택 관광'],
  E'1일차: 인천공항 출발 → 나리타공항 도착 → 호텔 체크인\n2일차: 우에노 공원 벚꽃 구경 → 아사쿠사 센소지 → 도쿄 스카이트리\n3일차: 치도리가후치 벚꽃 → 황궁 동쪽 정원 → 긴자 쇼핑\n4일차: 신주쿠 교엔 → 메이지 신궁 → 하라주쿠\n5일차: 자유시간 → 나리타공항 출발 → 인천공항 도착'
),
(
  '오사카 & 교토 문화 체험 6일',
  '일본 관서 지역의 전통 문화와 현대적 매력을 동시에 느낄 수 있는 완벽한 문화 체험 여행입니다.',
  '일본 오사카/교토',
  (SELECT id FROM categories WHERE name = '일본' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  6,
  1380000,
  '2025-11-10',
  '2025-11-15',
  18,
  7,
  'https://images.unsplash.com/photo-1578774204375-826dc5254c49?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 5박', '전문 가이드', '조식 5회', '문화 체험'],
  ARRAY['점심/저녁 식사', '개인 경비', '온천 입욕료', '기모노 대여'],
  E'1일차: 인천공항 출발 → 간사이공항 도착 → 오사카 시내\n2일차: 오사카성 → 도톤보리 → 신세카이\n3일차: 교토 이동 → 기요미즈데라 → 기온 거리\n4일차: 금각사 → 죽림의 길 → 후시미 이나리\n5일차: 나라 투어 → 토다이지 → 사슴공원\n6일차: 자유시간 → 간사이공항 출발 → 인천공항 도착'
),
(
  '후쿠오카 온천 & 먹거리 투어 4일',
  '일본 규슈 지역의 온천과 신선한 해산물, 라멘 등 다양한 먹거리를 즐기는 미식 여행입니다.',
  '일본 후쿠오카',
  (SELECT id FROM categories WHERE name = '일본' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  4,
  890000,
  '2025-12-05',
  '2025-12-08',
  15,
  4,
  'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 3박', '전문 가이드', '조식 3회', '온천 입욕'],
  ARRAY['점심/저녁 식사', '개인 경비', '추가 온천', '선택 관광'],
  E'1일차: 부산공항 출발 → 후쿠오카공항 도착 → 시내 관광\n2일차: 유후인 온천 → 벳푸 지옥 순례\n3일차: 하카타 라멘 투어 → 모모치하마 해변\n4일차: 자유시간 → 후쿠오카공항 출발 → 부산공항 도착'
),

-- 중국 패키지
(
  '중국 베이징 & 상하이 7일',
  '중국의 수도 베이징과 경제 중심지 상하이에서 중국의 역사와 현대를 모두 체험하는 여행입니다.',
  '중국 베이징/상하이',
  (SELECT id FROM categories WHERE name = '중국' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  7,
  1680000,
  '2025-10-20',
  '2025-10-26',
  28,
  10,
  'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 6박', '전문 가이드', '조식 6회', '시내 관광', '고속철도'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '선택 관광'],
  E'1일차: 인천공항 출발 → 베이징 도착 → 호텔 체크인\n2일차: 천안문 광장 → 자금성 → 이화원\n3일차: 만리장성 → 명십삼릉\n4일차: 베이징 → 상하이 이동 (고속철도)\n5일차: 와이탄 → 동방명주탑 → 예원\n6일차: 상하이 자유시간 → 쇼핑\n7일차: 상하이 출발 → 인천공항 도착'
),
(
  '중국 실크로드 서안 & 란저우 8일',
  '실크로드의 출발점 서안과 란저우에서 고대 중국의 찬란한 문화와 역사를 체험하는 특별한 여행입니다.',
  '중국 서안/란저우',
  (SELECT id FROM categories WHERE name = '중국' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  8,
  2200000,
  '2025-09-25',
  '2025-10-02',
  20,
  5,
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 7박', '전문 가이드', '조식 7회', '내륙 항공료'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '선택 관광'],
  E'1일차: 인천공항 출발 → 서안 도착\n2일차: 병마용 박물관 → 화청지\n3일차: 서안 성벽 → 회족거리 → 대안탑\n4일차: 서안 → 란저우 이동\n5일차: 황하 철교 → 백탑산 공원\n6일차: 란저우 → 서안 이동\n7일차: 서안 자유시간 → 쇼핑\n8일차: 서안 출발 → 인천공항 도착'
),

-- 미주/중남미/하와이 패키지
(
  '하와이 호놀룰루 허니문 7일',
  '태평양의 진주 하와이에서 로맨틱한 허니문과 다양한 액티비티를 즐기는 특별한 여행입니다.',
  '하와이 호놀룰루',
  (SELECT id FROM categories WHERE name = '미주/하와이/중남미' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  7,
  2800000,
  '2025-11-15',
  '2025-11-21',
  16,
  4,
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  ARRAY['왕복 항공료', '5성급 리조트 6박', '공항 픽업/샌딩', '조식 6회', '허니문 패키지'],
  ARRAY['점심/저녁 식사', '개인 경비', '선택 관광', '액티비티'],
  E'1일차: 인천공항 출발 → 호놀룰루공항 도착 → 리조트 체크인\n2일차: 와이키키 해변 → 다이아몬드 헤드 → 펄하버\n3일차: 폴리네시안 문화센터 → 노스쇼어\n4일차: 하나우마베이 스노클링 → 쇼핑\n5일차: 자유시간 → 해변 휴식\n6일차: 선셋 크루즈 → 루아우 쇼\n7일차: 자유시간 → 호놀룰루공항 출발 → 인천공항 도착'
),
(
  '괌 자유여행 5일',
  '서태평양의 낙원 괌에서 즐기는 자유로운 휴양과 다양한 액티비티가 가능한 여행입니다.',
  '괌',
  (SELECT id FROM categories WHERE name = '미주/하와이/중남미' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  5,
  890000,
  '2025-12-05',
  '2025-12-09',
  22,
  7,
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 4박', '공항 픽업/샌딩', '조식 4회'],
  ARRAY['점심/저녁 식사', '개인 경비', '선택 관광', '액티비티'],
  E'1일차: 인천공항 출발 → 괌공항 도착 → 호텔 체크인\n2일차: 자유시간 → 투몬베이 해변\n3일차: 선택 관광 (스노클링, 돌핀워칭 등)\n4일차: 쇼핑 → 해변 휴식\n5일차: 자유시간 → 괌공항 출발 → 인천공항 도착'
),
(
  '미국 서부 라스베가스 & LA 8일',
  '미국 서부의 화려한 도시 라스베가스와 천사의 도시 LA에서 미국의 문화를 만끽하는 여행입니다.',
  '미국 라스베가스/LA',
  (SELECT id FROM categories WHERE name = '미주/하와이/중남미' AND parent_id = (SELECT id FROM categories WHERE name = '해외여행' AND parent_id IS NULL)),
  8,
  3200000,
  '2025-10-01',
  '2025-10-08',
  24,
  9,
  'https://images.unsplash.com/photo-1464822759844-d150ad6d1e7f?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 7박', '전문 가이드', '조식 7회', '시내 관광'],
  ARRAY['점심/저녁 식사', '개인 경비', '쇼 티켓', '선택 관광'],
  E'1일차: 인천공항 출발 → 라스베가스 도착\n2일차: 라스베가스 시내 관광 → 카지노 체험\n3일차: 그랜드캐년 투어\n4일차: 라스베가스 → LA 이동\n5일차: 할리우드 → 비버리힐스 → 산타모니카\n6일차: 디즈니랜드 또는 유니버설 스튜디오\n7일차: LA 자유시간 → 쇼핑\n8일차: LA 출발 → 인천공항 도착'
),

-- 국내 패키지
(
  '제주도 힐링 여행 3일',
  '아름다운 자연과 독특한 문화를 간직한 제주도에서 힐링과 관광을 동시에 즐기는 국내 여행입니다.',
  '제주도',
  (SELECT id FROM categories WHERE name = '국내' AND parent_id IS NULL),
  3,
  450000,
  '2025-09-15',
  '2025-09-17',
  20,
  6,
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
  ARRAY['왕복 항공료', '4성급 호텔 2박', '렌터카', '전문 가이드', '조식 2회'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '주유비'],
  E'1일차: 김포공항 출발 → 제주공항 도착 → 성산일출봉 → 섭지코지\n2일차: 한라산 둘레길 → 천지연폭포 → 중문 관광단지\n3일차: 협재해수욕장 → 제주민속촌 → 제주공항 출발 → 김포공항 도착'
),
(
  '부산 & 경주 역사 문화 투어 4일',
  '부산의 현대적 매력과 경주의 천년 역사를 함께 체험하는 의미있는 국내 여행입니다.',
  '부산/경주',
  (SELECT id FROM categories WHERE name = '국내' AND parent_id IS NULL),
  4,
  380000,
  '2025-10-12',
  '2025-10-15',
  25,
  8,
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  ARRAY['KTX 왕복', '4성급 호텔 3박', '전문 가이드', '조식 3회', '시내 관광'],
  ARRAY['점심/저녁 식사', '개인 경비', '입장료', '선택 관광'],
  E'1일차: 서울역 출발 → 부산역 도착 → 해운대 → 광안리\n2일차: 감천문화마을 → 태종대 → 자갈치시장\n3일차: 부산 → 경주 이동 → 불국사 → 석굴암\n4일차: 첨성대 → 안압지 → 부산역 출발 → 서울역 도착'
);

-- 샘플 사용자 데이터 (리뷰를 위해)
INSERT INTO users (email, name, phone) VALUES 
('user1@example.com', '김철수', '010-1234-5678'),
('user2@example.com', '이영희', '010-2345-6789'),
('user3@example.com', '박민수', '010-3456-7890');

-- 샘플 리뷰 데이터
INSERT INTO reviews (user_id, package_id, rating, comment) VALUES 
((SELECT id FROM users WHERE email = 'user1@example.com'), 
 (SELECT id FROM packages WHERE title = '도쿄 벚꽃 여행 5일'), 
 5, 
 '정말 환상적인 여행이었습니다! 벚꽃이 만개한 시기라 더욱 아름다웠어요. 가이드분도 친절하시고 일정도 알차게 구성되어 있었습니다.'),
 
((SELECT id FROM users WHERE email = 'user2@example.com'), 
 (SELECT id FROM packages WHERE title = '도쿄 벚꽃 여행 5일'), 
 4, 
 '벚꽃 구경하기 좋은 시기였고 호텔도 깨끗했습니다. 다만 자유시간이 조금 더 있었으면 좋겠어요.'),
 
((SELECT id FROM users WHERE email = 'user3@example.com'), 
 (SELECT id FROM packages WHERE title = '방콕 & 파타야 힐링 여행 6일'), 
 5, 
 '완전 힐링 여행이었어요! 태국 음식도 맛있고 마사지도 최고였습니다. 파타야 해변이 정말 예뻤어요.'),

((SELECT id FROM users WHERE email = 'user1@example.com'), 
 (SELECT id FROM packages WHERE title = '유럽 3개국 투어 10일'), 
 5, 
 '유럽의 아름다운 도시들을 한 번에 볼 수 있어서 정말 좋았습니다. 특히 스위스 융프라우의 경치가 잊을 수 없어요!'),

((SELECT id FROM users WHERE email = 'user2@example.com'), 
 (SELECT id FROM packages WHERE title = '하와이 호놀룰루 허니문 7일'), 
 5, 
 '신혼여행으로 완벽했어요! 리조트 시설도 최고급이고 허니문 패키지 서비스가 정말 로맨틱했습니다.'),

((SELECT id FROM users WHERE email = 'user3@example.com'), 
 (SELECT id FROM packages WHERE title = '제주도 힐링 여행 3일'), 
 4, 
 '국내 여행이지만 정말 힐링되는 시간이었어요. 렌터카로 자유롭게 돌아다닐 수 있어서 좋았습니다.');

-- Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public 읽기 권한 정책
CREATE POLICY "Public packages are viewable by everyone" ON packages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- 사용자별 데이터 접근 정책
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
