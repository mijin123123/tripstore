-- 관리자 시스템 완전 초기화 및 설정
-- Supabase SQL 에디터에서 순서대로 실행하세요

-- 1. 기존 관리자 테이블 삭제 (있다면)
DROP TABLE IF EXISTS public.admins CASCADE;

-- 2. 관리자 테이블 새로 생성
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  permissions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. RLS 완전 비활성화
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- 4. 기존 정책들 모두 삭제
DROP POLICY IF EXISTS "관리자 테이블 접근 정책" ON public.admins;
DROP POLICY IF EXISTS "관리자 알림 정책" ON public.admin_notifications;
DROP POLICY IF EXISTS "슈퍼 관리자 로그 접근 정책" ON public.admin_access_logs;

-- 5. 관리자 계정 추가
INSERT INTO public.admins (email, name, role, permissions) 
VALUES (
  'sonchanmin89@gmail.com', 
  '시스템 관리자', 
  'superadmin',
  '{"packages": true, "reservations": true, "notices": true, "users": true, "settings": true}'::jsonb
);

-- 6. 테이블 확인
SELECT * FROM public.admins;

-- 7. 테이블 구조 확인
\d public.admins;
