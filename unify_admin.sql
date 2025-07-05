-- 관리자 통일 및 업데이트 스크립트
-- 모든 관리자를 sonchanmin89@gmail.com으로 통일

-- 1. 기존 관리자 데이터 삭제 (sonchanmin89@gmail.com 제외)
DELETE FROM public.admins 
WHERE email != 'sonchanmin89@gmail.com';

-- 2. sonchanmin89@gmail.com 슈퍼 관리자로 설정 (없으면 추가, 있으면 업데이트)
INSERT INTO public.admins (email, name, role, permissions, is_active) 
VALUES (
  'sonchanmin89@gmail.com', 
  '시스템 슈퍼 관리자', 
  'superadmin',
  '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb,
  true
)
ON CONFLICT (email) DO UPDATE SET 
  name = '시스템 슈퍼 관리자',
  role = 'superadmin',
  permissions = '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb,
  is_active = true,
  updated_at = now();

-- 3. auth.users 테이블에서도 관리자 계정 확인 및 업데이트
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
  '{"name": "시스템 슈퍼 관리자"}',
  false,
  'authenticated'
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('aszx1212', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now(),
  raw_user_meta_data = '{"name": "시스템 슈퍼 관리자"}';

-- 4. 확인
SELECT 
  'admins 테이블' as table_name,
  email,
  name,
  role,
  permissions,
  is_active
FROM public.admins 
WHERE email = 'sonchanmin89@gmail.com'

UNION ALL

SELECT 
  'auth.users 테이블' as table_name,
  email,
  raw_user_meta_data->>'name' as name,
  role,
  'N/A' as permissions,
  CASE WHEN email_confirmed_at IS NOT NULL THEN 'true' ELSE 'false' END as is_active
FROM auth.users 
WHERE email = 'sonchanmin89@gmail.com';
