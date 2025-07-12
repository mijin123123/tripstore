-- 모든 RLS 정책을 완전히 비활성화하는 스크립트
-- 이 스크립트는 관리자 권한으로 실행해야 합니다

-- 1. packages 테이블의 모든 RLS 정책 제거
DROP POLICY IF EXISTS "packages_select_policy" ON packages;
DROP POLICY IF EXISTS "packages_insert_policy" ON packages;
DROP POLICY IF EXISTS "packages_update_policy" ON packages;
DROP POLICY IF EXISTS "packages_delete_policy" ON packages;

-- 2. RLS 완전 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- 3. 관리자 테이블도 RLS 비활성화
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 4. 예약 테이블도 RLS 비활성화
ALTER TABLE reservations DISABLE ROW LEVEL SECURITY;

-- 5. 공지사항 테이블도 RLS 비활성화
ALTER TABLE notices DISABLE ROW LEVEL SECURITY;

-- 6. 리뷰 테이블도 RLS 비활성화 (존재하는 경우)
ALTER TABLE IF EXISTS reviews DISABLE ROW LEVEL SECURITY;

-- 7. 확인용 쿼리
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('packages', 'admins', 'reservations', 'notices', 'reviews');

-- 8. 정책 확인
SELECT 
    tablename,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE schemaname = 'public';
