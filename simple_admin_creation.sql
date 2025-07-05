-- 🚨 즉시 실행 스크립트 - 오류 없이 관리자 생성
-- Supabase SQL Editor에서 실행

-- 1. 먼저 기존 사용자 삭제 (있다면)
DELETE FROM auth.users WHERE email = 'sonchanmin89@gmail.com';

-- 2. 관리자 계정 생성 (ON CONFLICT 없이)
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
  '{"name": "슈퍼 관리자"}',
  false,
  'authenticated'
);
