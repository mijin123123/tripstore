-- 🚨 더 간단한 방법 - Supabase Dashboard에서 실행
-- 이 방법이 가장 안전합니다

-- 1. packages 테이블만 먼저 생성
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    available_dates TEXT,
    description TEXT,
    includes TEXT,
    excludes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. RLS 완전 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- 3. 샘플 패키지 추가
INSERT INTO packages (title, destination, price, duration, category, image_url, available_dates, description, includes, excludes) VALUES
('나만의 수도 도쿄 여행', '일본 도쿄', 1290000, 5, '일본 여행과', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 
'2025-07-15, 2025-07-29, 2025-08-12, 2025-08-26, 2025-09-09, 2025-09-23', 
'도쿄의 다양한 명소를 즐기는 특별한 여행', 
'항공료, 4성급 호텔, 조식 4회, 전용 가이드', 
'점심 식사, 석식 관광, 개인 경비, 가이드/기사 팁');

-- 4. 확인
SELECT * FROM packages;
