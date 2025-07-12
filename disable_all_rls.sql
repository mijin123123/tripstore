-- 패키지 수정 오류 해결을 위한 완전한 RLS 비활성화
-- Supabase SQL 에디터에서 실행하세요

-- 1. 모든 기존 정책 삭제
DROP POLICY IF EXISTS "익명 사용자 읽기 권한" ON packages;
DROP POLICY IF EXISTS "관리자 전체 권한" ON packages;
DROP POLICY IF EXISTS "인증된 사용자 관리 권한" ON packages;
DROP POLICY IF EXISTS "Enable read access for all users" ON packages;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON packages;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON packages;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON packages;

-- 2. RLS 완전 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- 3. 예약 테이블도 동일하게 처리
DROP POLICY IF EXISTS "사용자 예약 읽기 권한" ON reservations;
DROP POLICY IF EXISTS "관리자 예약 관리 권한" ON reservations;
DROP POLICY IF EXISTS "Enable read access for all users" ON reservations;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reservations;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON reservations;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON reservations;

ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- 4. 공지사항 테이블도 동일하게 처리
DROP POLICY IF EXISTS "공지사항 읽기 권한" ON notices;
DROP POLICY IF EXISTS "관리자 공지사항 관리 권한" ON notices;
DROP POLICY IF EXISTS "Enable read access for all users" ON notices;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON notices;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON notices;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON notices;

ALTER TABLE notices DISABLE ROW LEVEL SECURITY;

-- 5. 리뷰 테이블도 동일하게 처리
DROP POLICY IF EXISTS "사용자 리뷰 읽기 권한" ON reviews;
DROP POLICY IF EXISTS "관리자 리뷰 관리 권한" ON reviews;
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reviews;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON reviews;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON reviews;

ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- 6. 확인
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('packages', 'reservations', 'notices', 'reviews', 'admins');

-- 7. 테스트용 패키지 데이터 확인
SELECT id, title, destination, price FROM packages LIMIT 5;
