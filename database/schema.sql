-- 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 여행 패키지 테이블
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER NOT NULL,
    duration VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    reviews INTEGER NOT NULL DEFAULT 0,
    departure_date DATE NOT NULL,
    available_spots INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 예약 테이블
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    travelers INTEGER NOT NULL,
    departure_date DATE NOT NULL,
    total_price INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_packages_location ON packages(location);
CREATE INDEX IF NOT EXISTS idx_packages_price ON packages(price);
CREATE INDEX IF NOT EXISTS idx_packages_departure_date ON packages(departure_date);
CREATE INDEX IF NOT EXISTS idx_reservations_package_id ON reservations(package_id);
CREATE INDEX IF NOT EXISTS idx_reservations_user_email ON reservations(user_email);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO packages (title, location, price, original_price, duration, description, highlights, images, rating, reviews, departure_date, available_spots) VALUES
('일본 도쿄 & 오사카 5일', '일본', 1200000, 1500000, '4박 5일', '일본의 전통과 현대가 만나는 도쿄와 오사카를 4박 5일간 완벽하게 체험할 수 있는 패키지입니다.', 
 ARRAY['온천 체험', '후지산 투어', '유니버설 스튜디오'], 
 ARRAY['https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80'], 
 4.8, 324, '2024-03-15', 8),

('유럽 3국 로맨틱 투어', '프랑스, 이탈리아, 스위스', 2800000, 3200000, '7박 8일', '유럽의 낭만을 만끽할 수 있는 프랑스, 이탈리아, 스위스 3국 투어입니다.', 
 ARRAY['에펠탑', '로마 콜로세움', '융프라우'], 
 ARRAY['https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80', 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80'], 
 4.9, 156, '2024-03-20', 12),

('발리 럭셔리 리조트', '인도네시아', 1800000, 2200000, '5박 6일', '발리의 아름다운 자연과 럭셔리한 리조트에서 완벽한 휴식을 즐겨보세요.', 
 ARRAY['오션뷰 빌라', '스파 패키지', '전용 해변'], 
 ARRAY['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80', 'https://images.unsplash.com/photo-1544369485-7750e0c8f2b6?w=800&q=80'], 
 4.7, 289, '2024-03-25', 5),

('뉴욕 & 라스베가스', '미국', 2200000, 2600000, '6박 7일', '미국의 대표 도시 뉴욕과 라스베가스에서 특별한 경험을 만들어보세요.', 
 ARRAY['브로드웨이 뮤지컬', '그랜드캐니언', '카지노'], 
 ARRAY['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'], 
 4.6, 412, '2024-03-30', 15),

('일본 홋카이도 삿포로', '일본', 1400000, 1700000, '5박 6일', '홋카이도의 아름다운 자연과 신선한 해산물을 만끽하는 여행입니다.', 
 ARRAY['온천', '게 요리', '눈축제'], 
 ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', 'https://images.unsplash.com/photo-1576095231164-52d5d8e3c3c4?w=800&q=80'], 
 4.7, 198, '2024-04-05', 10),

('일본 도쿄 디즈니랜드', '일본', 1600000, 1900000, '5박 6일', '가족과 함께 즐기는 도쿄 디즈니랜드와 후지산 투어입니다.', 
 ARRAY['디즈니랜드', '후지산', '온천'], 
 ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80'], 
 4.8, 567, '2024-04-10', 20);

-- Row Level Security (RLS) 정책 설정
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- packages 테이블은 모든 사용자가 읽을 수 있음
CREATE POLICY "Enable read access for all users" ON packages FOR SELECT USING (true);

-- reservations 테이블은 사용자가 자신의 예약만 볼 수 있음
CREATE POLICY "Users can view own reservations" ON reservations FOR SELECT USING (auth.email() = user_email);
CREATE POLICY "Users can insert own reservations" ON reservations FOR INSERT WITH CHECK (auth.email() = user_email);
