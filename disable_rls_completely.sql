-- 관리자 테이블 RLS 완전 비활성화 및 권한 설정
-- Supabase SQL 에디터에서 실행

-- 1. 기존 RLS 정책 모두 제거
DROP POLICY IF EXISTS "Enable read access for all users" ON admins;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON admins;
DROP POLICY IF EXISTS "Enable update for users based on email" ON admins;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON admins;

-- 2. RLS 비활성화
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 3. 테이블 권한 설정 (익명 사용자도 읽기 가능하도록)
GRANT SELECT ON admins TO anon;
GRANT SELECT ON admins TO authenticated;

-- 4. 관리자 계정 확인 및 삽입
INSERT INTO admins (email, role, created_at)
VALUES ('sonchanmin89@gmail.com', 'admin', NOW())
ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- 5. 확인 쿼리
SELECT * FROM admins WHERE email = 'sonchanmin89@gmail.com';
