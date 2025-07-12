-- 기존 테이블 및 제약 조건 정리를 위한 스크립트
-- 주의: 이 스크립트는 기존 데이터를 모두 삭제합니다!

-- 외래 키 제약 조건 삭제
ALTER TABLE IF EXISTS public.admin_notifications DROP CONSTRAINT IF EXISTS admin_notifications_admin_id_fkey;
ALTER TABLE IF EXISTS public.admin_access_logs DROP CONSTRAINT IF EXISTS admin_access_logs_admin_id_fkey;

-- 테이블 삭제
DROP TABLE IF EXISTS public.admin_notifications;
DROP TABLE IF EXISTS public.admin_access_logs;
DROP TABLE IF EXISTS public.admins;

-- 결과 확인
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('admins', 'admin_notifications', 'admin_access_logs');
