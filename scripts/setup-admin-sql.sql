-- Supabase SQL 에디터에서 실행할 쿼리

-- 1. 이미 사용자가 존재하는지 확인
SELECT * FROM auth.users WHERE email = 'admin@tripstore.com';

-- 2. users 테이블에서 해당 사용자의 정보 확인
SELECT * FROM users WHERE email = 'admin@tripstore.com';

-- 3. 사용자가 users 테이블에 존재하지 않으면 추가 (auth.users에는 있지만 users 테이블에 없는 경우)
INSERT INTO users (id, email, name, is_admin, created_at, updated_at)
SELECT id, email, '관리자', true, created_at, updated_at
FROM auth.users
WHERE email = 'admin@tripstore.com'
ON CONFLICT (id) DO NOTHING;

-- 4. 이미 존재하는 사용자라면 is_admin 속성을 true로 업데이트
UPDATE users
SET is_admin = true, 
    name = COALESCE(name, '관리자')
WHERE email = 'admin@tripstore.com';

-- 5. 결과 확인
SELECT * FROM users WHERE email = 'admin@tripstore.com';
