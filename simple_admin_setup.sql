-- 간단한 관리자 계정 생성 스크립트
-- Supabase SQL 에디터에서 실행하세요

-- 1. 관리자 테이블이 없다면 생성
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  permissions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. RLS 비활성화 (테스트용)
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- 3. 관리자 계정 추가
INSERT INTO public.admins (email, name, role, permissions) 
VALUES (
  'sonchanmin89@gmail.com', 
  '시스템 관리자', 
  'superadmin',
  '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = true;

-- 4. 확인
SELECT * FROM public.admins WHERE email = 'sonchanmin89@gmail.com';
