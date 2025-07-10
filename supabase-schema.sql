-- Supabase 데이터베이스 스키마 설정
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 패키지(여행 상품) 테이블 생성
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  destination TEXT NOT NULL,
  price NUMERIC NOT NULL,
  discountprice NUMERIC,
  duration INTEGER NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  images TEXT[],
  isfeatured BOOLEAN DEFAULT false,
  isonsale BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 4.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 예약 테이블 생성
CREATE TABLE IF NOT EXISTS reservations (
  id SERIAL PRIMARY KEY,
  package_id INTEGER NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  reservation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  travel_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  adults INTEGER NOT NULL,
  children INTEGER DEFAULT 0,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 샘플 패키지 데이터 삽입
INSERT INTO packages (title, description, destination, price, duration, category, image_url) VALUES
('제주도 3박 4일 힐링 여행', '아름다운 제주도에서 즐기는 힐링 여행 패키지입니다. 한라산, 성산일출봉, 우도 등 제주의 대표 명소를 둘러보며 자연 속에서 휴식을 취할 수 있습니다.', '제주도', 299000, 4, '힐링', 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b'),
('부산 바다 여행 2박 3일', '부산의 아름다운 바다와 맛집을 즐기는 여행입니다. 해운대, 광안리, 감천문화마을 등을 둘러보며 부산의 매력을 만끽하세요.', '부산', 199000, 3, '바다', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'),
('경주 역사 문화 투어', '천년 고도 경주의 역사와 문화를 체험하는 여행입니다. 불국사, 석굴암, 첨성대 등 유네스코 세계문화유산을 둘러보세요.', '경주', 159000, 2, '문화', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'),
('강릉 커피 투어', '강릉의 유명한 커피거리와 바다를 함께 즐기는 여행입니다. 안목해변 커피거리에서 바다를 보며 커피를 마시고, 정동진에서 일출도 감상하세요.', '강릉', 179000, 2, '미식', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19'),
('전주 한옥마을 체험', '전주 한옥마을에서 전통 문화를 체험하는 여행입니다. 한복 체험, 비빔밥 만들기, 한지 공예 등 다양한 체험이 준비되어 있습니다.', '전주', 149000, 2, '문화', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96');

-- 샘플 예약 데이터 삽입
INSERT INTO reservations (package_id, user_id, reservation_date, travel_date, status, payment_status, adults, children, total_price) VALUES
(1, 'user123', NOW(), NOW() + INTERVAL '7 days', 'confirmed', 'paid', 2, 0, 299000),
(2, 'user456', NOW(), NOW() + INTERVAL '14 days', 'pending', 'unpaid', 2, 1, 199000),
(3, 'user789', NOW(), NOW() + INTERVAL '21 days', 'confirmed', 'paid', 1, 0, 159000);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination);
CREATE INDEX IF NOT EXISTS idx_reservations_package_id ON reservations(package_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);

-- updated_at 자동 업데이트 함수 및 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
