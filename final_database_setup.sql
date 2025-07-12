-- 🔥 최종 해결 방법: 패키지 테이블만 생성하고 인증은 별도로 처리
-- 이것만 Supabase SQL Editor에서 실행하세요

-- 1. 기존 테이블 확인
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 2. packages 테이블 생성 (이미 있어도 오류 없음)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    category VARCHAR(100) DEFAULT 'general',
    image_url TEXT,
    available_dates TEXT,
    description TEXT,
    includes TEXT,
    excludes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. admins 테이블 생성
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. 모든 RLS 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 5. 관리자 정보만 추가 (auth.users는 건드리지 않음)
INSERT INTO admins (email, name, role, permissions, is_active) 
VALUES (
    'sonchanmin89@gmail.com', 
    '슈퍼 관리자', 
    'superadmin',
    '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb,
    true
)
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    is_active = true;

-- 6. 샘플 패키지 데이터 추가
INSERT INTO packages (title, destination, price, duration, category, image_url, available_dates, description, includes, excludes) VALUES
('나만의 수도 도쿄 여행', '일본 도쿄', 1290000, 5, '일본 여행과', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 
'2025-07-15, 2025-07-29, 2025-08-12, 2025-08-26, 2025-09-09, 2025-09-23', 
'도쿄의 다양한 명소를 즐기는 특별한 여행', 
'항공료, 4성급 호텔, 조식 4회, 전용 가이드', 
'점심 식사, 석식 관광, 개인 경비, 가이드/기사 팁'),

('서울 한옥마을 투어', '한국 서울', 890000, 3, '국내 관광', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
'2025-07-20, 2025-08-03, 2025-08-17, 2025-08-31', 
'전통 한옥마을에서 체험하는 한국의 아름다움',
'숙박료, 전통 체험, 한복 대여, 가이드 동행',
'개인 용돈, 추가 체험비, 교통비'),

('부산 해운대 바다 여행', '한국 부산', 650000, 2, '국내 관광', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
'2025-07-25, 2025-08-08, 2025-08-22', 
'부산의 아름다운 바다와 맛있는 음식을 즐기는 여행',
'숙박료, 조식, 가이드 동행, 해운대 투어',
'개인 용돈, 점심/저녁 식사, 교통비');

-- 7. 최종 확인
SELECT 'packages' as table_name, count(*) as count FROM packages
UNION ALL
SELECT 'admins' as table_name, count(*) as count FROM admins;
