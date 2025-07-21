-- 히어로 이미지 테이블 생성
CREATE TABLE IF NOT EXISTS hero_images (
  id SERIAL PRIMARY KEY,
  page_type TEXT NOT NULL, -- 'main', 'overseas', 'domestic', 'hotel', 'luxury' 등
  page_slug TEXT, -- 서브 카테고리 페이지의 경우 (europe, japan 등)
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  gradient_overlay TEXT DEFAULT 'linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.4) 100%)',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 같은 페이지 유형과 슬러그에서 한 번에 하나의 이미지만 활성화될 수 있도록 제약조건 추가
CREATE UNIQUE INDEX hero_images_unique_active_idx ON hero_images (page_type, page_slug) WHERE is_active = true;

-- 인덱스 생성
CREATE INDEX hero_images_page_type_idx ON hero_images(page_type);
CREATE INDEX hero_images_page_slug_idx ON hero_images(page_slug);
CREATE INDEX hero_images_is_active_idx ON hero_images(is_active);

-- 초기 데이터 삽입
INSERT INTO hero_images (page_type, page_slug, title, subtitle, image_url, gradient_overlay)
VALUES 
  -- 메인 페이지
  ('main', NULL, '전 세계 어디든, 당신의 꿈을 현실로', '맞춤형 여행 패키지와 전문 가이드 서비스로 특별한 추억을 만들어보세요', '/images/main-hero.jpg', 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'),
  
  -- 해외 여행 카테고리
  ('overseas', NULL, '해외 여행', '전 세계 환상적인 목적지로의 여행', '/images/overseas-hero.jpg', 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)'),
  ('overseas', 'europe', '유럽', '역사와 문화의 보고, 유럽으로의 여행', '/images/europe-hero.jpg', 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(30, 58, 138, 0.3) 100%)'),
  ('overseas', 'japan', '일본', '전통과 현대가 공존하는 일본의 매력', '/images/japan-hero.jpg', 'linear-gradient(135deg, rgba(220, 38, 38, 0.3) 0%, rgba(185, 28, 28, 0.3) 100%)'),
  ('overseas', 'southeast-asia', '동남아시아', '이국적인 문화와 아름다운 자연의 조화', '/images/southeast-asia-hero.jpg', 'linear-gradient(135deg, rgba(5, 150, 105, 0.3) 0%, rgba(4, 120, 87, 0.3) 100%)'),
  ('overseas', 'americas', '아메리카', '광활한 대륙에서 만나는 다양한 경험', '/images/americas-hero.jpg', 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(109, 40, 217, 0.3) 100%)'),
  ('overseas', 'guam-saipan', '괌/사이판', '청정 자연과 함께하는 휴양지의 천국', '/images/guam-hero.jpg', 'linear-gradient(135deg, rgba(14, 165, 233, 0.3) 0%, rgba(2, 132, 199, 0.3) 100%)'),
  ('overseas', 'china-hongkong', '중국/홍콩', '동양의 신비를 간직한 매력적인 여행지', '/images/hongkong-hero.jpg', 'linear-gradient(135deg, rgba(202, 138, 4, 0.3) 0%, rgba(161, 98, 7, 0.3) 100%)'),
  
  -- 국내 여행 카테고리
  ('domestic', NULL, '국내 여행', '아름다운 우리나라 곳곳에서 특별한 추억을 만들어보세요', '/images/domestic-hero.jpg', 'linear-gradient(135deg, rgba(20, 83, 45, 0.3) 0%, rgba(22, 101, 52, 0.3) 100%)'),
  ('domestic', 'hotel', '국내 호텔', '최고의 편안함을 제공하는 국내 호텔', '/images/domestic-hotel-hero.jpg', 'linear-gradient(135deg, rgba(20, 83, 45, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'),
  ('domestic', 'pool-villa', '풀빌라', '프라이빗한 공간에서 즐기는 특별한 휴식', '/images/domestic-pool-villa-hero.jpg', 'linear-gradient(135deg, rgba(79, 70, 229, 0.3) 0%, rgba(67, 56, 202, 0.3) 100%)'),
  ('domestic', 'resort', '리조트', '다양한 시설과 편안한 휴식이 있는 곳', '/images/domestic-resort-hero.jpg', 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.3) 100%)'),
  
  -- 럭셔리 여행 카테고리
  ('luxury', NULL, '럭셔리 여행', '최고급 서비스와 독특한 경험이 어우러진 프리미엄 여행', '/images/luxury-hero.jpg', 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(124, 58, 237, 0.3) 50%, rgba(234, 179, 8, 0.3) 100%)'),
  ('luxury', 'europe', '럭셔리 유럽', '품격 있는 서비스로 완성하는 유럽 여행', '/images/luxury-europe-hero.jpg', 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)'),
  ('luxury', 'japan', '럭셔리 일본', '전통과 현대의 조화, 프리미엄 일본 여행', '/images/luxury-japan-hero.jpg', 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'),
  ('luxury', 'southeast-asia', '럭셔리 동남아시아', '이국적 풍경과 함께하는 프리미엄 휴양', '/images/luxury-southeast-asia-hero.jpg', 'linear-gradient(135deg, rgba(88, 28, 135, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'),
  ('luxury', 'cruise', '크루즈', '바다 위에서 즐기는 최고급 여행', '/images/luxury-cruise-hero.jpg', 'linear-gradient(135deg, rgba(3, 105, 161, 0.3) 0%, rgba(14, 165, 233, 0.3) 100%)'),
  ('luxury', 'special-theme', '특별 테마', '특별한 순간을 위한 맞춤형 럭셔리 여행', '/images/luxury-special-theme-hero.jpg', 'linear-gradient(135deg, rgba(136, 19, 55, 0.3) 0%, rgba(190, 24, 93, 0.3) 100%)'),
  
  -- 호텔 카테고리
  ('hotel', NULL, '호텔', '편안함과 럭셔리함이 공존하는 특별한 숙박 경험', '/images/hotel-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)'),
  ('hotel', 'europe', '유럽 호텔', '역사와 전통이 살아 숨쉬는 유럽 호텔', '/images/hotel-europe-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)'),
  ('hotel', 'japan', '일본 호텔', '일본 특유의 세심한 서비스를 경험하세요', '/images/hotel-japan-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)'),
  ('hotel', 'southeast-asia', '동남아시아 호텔', '이국적인 분위기의 럭셔리 호텔', '/images/hotel-southeast-asia-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(5, 150, 105, 0.3) 100%)'),
  ('hotel', 'americas', '아메리카 호텔', '규모와 서비스로 압도하는 호텔', '/images/hotel-americas-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(124, 58, 237, 0.3) 100%)'),
  ('hotel', 'china-hongkong', '중국/홍콩 호텔', '동양의 세련된 호텔 경험', '/images/hotel-china-hongkong-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(202, 138, 4, 0.3) 100%)'),
  ('hotel', 'guam-saipan', '괌/사이판 호텔', '천국 같은 해변과 함께하는 호텔', '/images/hotel-guam-saipan-hero.jpg', 'linear-gradient(135deg, rgba(8, 145, 178, 0.3) 0%, rgba(2, 132, 199, 0.3) 100%)');
