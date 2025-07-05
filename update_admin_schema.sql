-- 관리자 테이블 업데이트
ALTER TABLE admins ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'admin';
ALTER TABLE admins ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE admins ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE admins ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 관리자 테이블에서 RLS 비활성화
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "관리자 전체 권한" ON packages;

-- 새로운 정책 생성 (관리자 확인 없이)
CREATE POLICY "인증된 사용자 관리 권한" ON packages
  FOR ALL USING (auth.role() = 'authenticated');

-- 예약 테이블에 관리자 정책 추가
CREATE POLICY "관리자 예약 관리 권한" ON reservations
  FOR ALL USING (auth.role() = 'authenticated');

-- 공지사항 테이블에 관리자 정책 추가
CREATE POLICY "관리자 공지사항 관리 권한" ON notices
  FOR ALL USING (auth.role() = 'authenticated');

-- 리뷰 테이블에 관리자 정책 추가
CREATE POLICY "관리자 리뷰 관리 권한" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');
