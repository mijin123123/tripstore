-- 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 지역 테이블 생성
CREATE TABLE IF NOT EXISTS regions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ko TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  parent_id INTEGER REFERENCES regions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 사용자 테이블 (Supabase Auth와 연결)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  avatar_url TEXT,
  birthdate DATE,
  gender TEXT,
  address TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 패키지 테이블 생성
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  region_id INTEGER REFERENCES regions(id),
  region TEXT NOT NULL,
  region_ko TEXT NOT NULL,
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  rating DECIMAL(3, 1) NOT NULL,
  image TEXT NOT NULL,
  highlights JSONB NOT NULL,
  departure TEXT NOT NULL,
  description TEXT NOT NULL,
  itinerary JSONB,
  included JSONB,
  excluded JSONB,
  notes JSONB,
  features JSONB,
  max_people INTEGER,
  min_people INTEGER DEFAULT 1,
  category_id INTEGER REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 빌라 테이블 생성
CREATE TABLE IF NOT EXISTS villas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(3, 1) NOT NULL,
  price TEXT NOT NULL,
  features JSONB NOT NULL,
  region_id INTEGER REFERENCES regions(id),
  description TEXT,
  max_people INTEGER,
  bed_count INTEGER,
  bath_count INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id TEXT REFERENCES packages(id) ON DELETE CASCADE,
  villa_id TEXT REFERENCES villas(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((package_id IS NULL AND villa_id IS NOT NULL) OR (package_id IS NOT NULL AND villa_id IS NULL))
);

-- 예약 테이블
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  package_id TEXT REFERENCES packages(id) ON DELETE CASCADE,
  villa_id TEXT REFERENCES villas(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  people_count INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((package_id IS NULL AND villa_id IS NOT NULL) OR (package_id IS NOT NULL AND villa_id IS NULL))
);

-- 결제 테이블
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 위시리스트 테이블
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  package_id TEXT REFERENCES packages(id) ON DELETE CASCADE,
  villa_id TEXT REFERENCES villas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CHECK ((package_id IS NULL AND villa_id IS NOT NULL) OR (package_id IS NOT NULL AND villa_id IS NULL))
);

-- 프로모션 테이블
CREATE TABLE IF NOT EXISTS promotions (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  discount_percent INTEGER,
  discount_amount DECIMAL(10, 2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  promo_code TEXT UNIQUE,
  is_active BOOLEAN DEFAULT true,
  min_purchase DECIMAL(10, 2),
  max_discount DECIMAL(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 패키지 가용 날짜 테이블
CREATE TABLE IF NOT EXISTS package_available_dates (
  id SERIAL PRIMARY KEY,
  package_id TEXT REFERENCES packages(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  available_seats INTEGER NOT NULL,
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (package_id, date)
);

-- 빌라 가용 날짜 테이블
CREATE TABLE IF NOT EXISTS villa_available_dates (
  id SERIAL PRIMARY KEY,
  villa_id TEXT REFERENCES villas(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  price_modifier DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (villa_id, date)
);

-- 업데이트 시간 자동 갱신 함수
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 테이블에 트리거 추가
CREATE TRIGGER update_packages_modified
BEFORE UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_villas_modified
BEFORE UPDATE ON villas
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- 기존 카테고리 데이터 삭제 및 시퀀스 초기화
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- 기본 카테고리 추가 (id를 명시하지 않음)
INSERT INTO categories (name, slug, description) VALUES
('해외여행', 'overseas', '해외 여행 패키지'),
('호텔', 'hotel', '호텔 예약'),
('국내', 'domestic', '국내 여행 패키지'),
('럭셔리', 'luxury', '럭셔리 여행 상품');

-- 서브 카테고리 추가 (고유한 slug와 동적 parent_id 사용)

-- 해외여행 서브 카테고리
INSERT INTO categories (name, slug, description, parent_id) VALUES
('유럽', 'overseas-europe', '유럽 여행', (SELECT id from categories WHERE slug = 'overseas')),
('동남아', 'overseas-southeast-asia', '동남아시아 여행', (SELECT id from categories WHERE slug = 'overseas')),
('일본', 'overseas-japan', '일본 여행', (SELECT id from categories WHERE slug = 'overseas')),
('괌/사이판', 'overseas-guam-saipan', '괌 및 사이판 여행', (SELECT id from categories WHERE slug = 'overseas')),
('미주/캐나다/하와이', 'overseas-americas', '미주/캐나다/하와이 여행', (SELECT id from categories WHERE slug = 'overseas')),
('대만/홍콩/마카오', 'overseas-china-hongkong', '대만/홍콩/마카오 여행', (SELECT id from categories WHERE slug = 'overseas')),

-- 호텔 서브 카테고리
('유럽', 'hotel-europe', '유럽 호텔', (SELECT id from categories WHERE slug = 'hotel')),
('동남아', 'hotel-southeast-asia', '동남아시아 호텔', (SELECT id from categories WHERE slug = 'hotel')),
('일본', 'hotel-japan', '일본 호텔', (SELECT id from categories WHERE slug = 'hotel')),
('괌/사이판', 'hotel-guam-saipan', '괌 및 사이판 호텔', (SELECT id from categories WHERE slug = 'hotel')),
('미주/캐나다/하와이', 'hotel-americas', '미주/캐나다/하와이 호텔', (SELECT id from categories WHERE slug = 'hotel')),
('대만/홍콩/마카오', 'hotel-china-hongkong', '대만/홍콩/마카오 호텔', (SELECT id from categories WHERE slug = 'hotel')),

-- 국내여행 서브 카테고리
('호텔', 'domestic-hotel', '국내 호텔', (SELECT id from categories WHERE slug = 'domestic')),
('리조트', 'domestic-resort', '리조트 숙박', (SELECT id from categories WHERE slug = 'domestic')),
('풀빌라', 'domestic-pool-villa', '프라이빗 풀빌라', (SELECT id from categories WHERE slug = 'domestic')),

-- 럭셔리 서브 카테고리
('유럽', 'luxury-europe', '럭셔리 유럽 여행', (SELECT id from categories WHERE slug = 'luxury')),
('일본', 'luxury-japan', '럭셔리 일본 여행', (SELECT id from categories WHERE slug = 'luxury')),
('동남아', 'luxury-southeast-asia', '럭셔리 동남아시아 여행', (SELECT id from categories WHERE slug = 'luxury')),
('크루즈', 'luxury-cruise', '럭셔리 크루즈 여행', (SELECT id from categories WHERE slug = 'luxury')),
('이색테마', 'luxury-special-theme', '이색 테마 여행', (SELECT id from categories WHERE slug = 'luxury'));

-- id 시퀀스 재설정
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories), true);
