-- 🚨 긴급 테이블 생성 및 설정 스크립트
-- Supabase SQL Editor에서 실행하세요

-- 1. 먼저 existing 테이블들 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- 2. packages 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    available_dates TEXT[], -- 배열로 저장
    description TEXT,
    includes TEXT[],
    excludes TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. admins 테이블 생성 (존재하지 않는 경우)
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

-- 4. reservations 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50),
    selected_date DATE NOT NULL,
    guest_count INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. notices 테이블 생성 (존재하지 않는 경우)
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    is_important BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. 모든 테이블의 RLS 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;

-- 7. 관리자 계정 생성
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    role
) VALUES (
    gen_random_uuid(),
    'sonchanmin89@gmail.com',
    crypt('aszx1212', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "슈퍼 관리자"}',
    false,
    'authenticated'
)
ON CONFLICT (email) DO UPDATE SET
    encrypted_password = crypt('aszx1212', gen_salt('bf')),
    email_confirmed_at = now(),
    updated_at = now();

-- 8. 관리자 테이블에 추가
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

-- 9. 샘플 패키지 데이터 추가
INSERT INTO packages (title, destination, price, duration, category, image_url, available_dates, description, includes, excludes) VALUES
('나만의 수도 도쿄 여행', '일본 도쿄', 1290000, 5, '일본 여행과', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80', 
ARRAY['2025-07-15', '2025-07-29', '2025-08-12', '2025-08-26', '2025-09-09', '2025-09-23'], 
'도쿄의 다양한 명소를 즐기는 특별한 여행', 
ARRAY['항공료', '4성급 호텔', '조식 4회', '전용 가이드'], 
ARRAY['점심 식사', '석식 관광', '개인 경비', '가이드/기사 팁']),

('서울 한옥마을 투어', '한국 서울', 890000, 3, '국내 관광', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
ARRAY['2025-07-20', '2025-08-03', '2025-08-17', '2025-08-31'], 
'전통 한옥마을에서 체험하는 한국의 아름다움',
ARRAY['숙박료', '전통 체험', '한복 대여', '가이드 동행'],
ARRAY['개인 용돈', '추가 체험비', '교통비']);

-- 10. 최종 확인
SELECT 'packages' as table_name, count(*) as row_count FROM packages
UNION ALL
SELECT 'admins' as table_name, count(*) as row_count FROM admins
UNION ALL
SELECT 'reservations' as table_name, count(*) as row_count FROM reservations
UNION ALL
SELECT 'notices' as table_name, count(*) as row_count FROM notices;

-- 11. 관리자 확인
SELECT 
    u.email,
    u.email_confirmed_at,
    a.name,
    a.role,
    a.permissions
FROM auth.users u
JOIN admins a ON u.email = a.email
WHERE u.email = 'sonchanmin89@gmail.com';
