-- 즉시 관리자 변경 스크립트
-- Supabase SQL 에디터에서 바로 실행하세요

-- 1. 현재 관리자 확인
SELECT 'BEFORE UPDATE' as status, email, name, role FROM public.admins;

-- 2. 기존 관리자 삭제
DELETE FROM public.admins WHERE email != 'sonchanmin89@gmail.com';

-- 3. sonchanmin89@gmail.com을 슈퍼 관리자로 설정
INSERT INTO public.admins (email, name, role, permissions, is_active) 
VALUES (
  'sonchanmin89@gmail.com', 
  '시스템 관리자', 
  'superadmin',
  '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb,
  true
)
ON CONFLICT (email) DO UPDATE SET 
  name = '시스템 관리자',
  role = 'superadmin',
  permissions = '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb,
  is_active = true,
  updated_at = now();

-- 4. 결과 확인
SELECT 'AFTER UPDATE' as status, email, name, role, is_active FROM public.admins;
