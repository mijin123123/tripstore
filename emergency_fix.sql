-- 즉시 실행할 RLS 완전 비활성화 스크립트
-- Supabase 대시보드 → SQL Editor에서 실행

-- 1. 모든 테이블의 RLS 완전 비활성화
ALTER TABLE IF EXISTS packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reservations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notices DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS reviews DISABLE ROW LEVEL SECURITY;

-- 2. 모든 정책 제거
DROP POLICY IF EXISTS "Enable read access for all users" ON packages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON packages;
DROP POLICY IF EXISTS "Enable update for users based on email" ON packages;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON packages;
DROP POLICY IF EXISTS "packages_select_policy" ON packages;
DROP POLICY IF EXISTS "packages_insert_policy" ON packages;
DROP POLICY IF EXISTS "packages_update_policy" ON packages;
DROP POLICY IF EXISTS "packages_delete_policy" ON packages;

-- 3. 확인
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('packages', 'admins', 'reservations', 'notices', 'reviews');

-- 4. 관리자 계정 강제 생성
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

-- 5. 관리자 테이블 강제 생성
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
