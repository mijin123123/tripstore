-- 관리자 테이블에 password 필드 추가
ALTER TABLE admins ADD COLUMN IF NOT EXISTS password TEXT;
