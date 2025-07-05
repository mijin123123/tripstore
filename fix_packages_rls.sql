-- 패키지 수정 오류 해결을 위한 스크립트
-- RLS 정책 확인 및 수정

-- 1. 현재 packages 테이블의 RLS 상태 확인
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'packages';

-- 2. packages 테이블의 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'packages';

-- 3. packages 테이블에서 RLS 비활성화 (임시 해결책)
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- 4. 기존 정책 삭제
DROP POLICY IF EXISTS "익명 사용자 읽기 권한" ON packages;
DROP POLICY IF EXISTS "관리자 전체 권한" ON packages;
DROP POLICY IF EXISTS "인증된 사용자 관리 권한" ON packages;

-- 5. 단순한 정책 추가 (모든 인증된 사용자가 모든 작업 가능)
CREATE POLICY "모든 인증된 사용자 전체 권한" ON packages
  FOR ALL USING (auth.role() = 'authenticated');

-- 6. RLS 다시 활성화
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- 7. 확인
SELECT 'packages 테이블 정책 설정 완료' as status;
