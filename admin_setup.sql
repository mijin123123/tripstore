-- 관리자 설정을 위한 SQL 스크립트
-- Supabase SQL 에디터에서 실행해주세요.

-- 주의: 먼저 admin_reset.sql을 실행하여 기존 테이블을 정리하세요!

-- 1. 관리자 테이블 생성
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'admin',
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  permissions JSONB DEFAULT '{"packages": true, "reservations": true, "notices": true, "users": false, "settings": false}'::jsonb
);

-- 2. 관리자 추가하기 (기본 관리자)
INSERT INTO admins (email, name, role, permissions) 
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

-- 3. 테스트용 추가 관리자 (주석 처리)
/*
INSERT INTO admins (email, name, role, permissions) 
VALUES (
  'manager@tripstore.com', 
  '운영 관리자', 
  'manager',
  '{"packages": true, "reservations": true, "notices": true, "users": false, "settings": false}'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = true;
*/

-- 4. 관리자 알림 테이블 생성
CREATE TABLE public.admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.admins(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. 관리자 접근 로그 테이블 생성
CREATE TABLE public.admin_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.admins(id),
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. RLS 정책 설정 (테이블이 존재하는지 확인 후)
DO $$
BEGIN
  -- admin_notifications 테이블에 RLS 정책 설정
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_notifications') THEN
    ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
    
    -- 기존 정책 삭제 시도
    BEGIN
      DROP POLICY IF EXISTS "관리자 알림 정책" ON public.admin_notifications;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error dropping policy on admin_notifications: %', SQLERRM;
    END;
    
    -- 새 정책 생성
    CREATE POLICY "관리자 알림 정책" ON public.admin_notifications
      FOR ALL USING (admin_id = auth.uid());
  END IF;
  
  -- admin_access_logs 테이블에 RLS 정책 설정
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_access_logs') THEN
    ALTER TABLE public.admin_access_logs ENABLE ROW LEVEL SECURITY;
    
    -- 기존 정책 삭제 시도
    BEGIN
      DROP POLICY IF EXISTS "슈퍼 관리자 로그 접근 정책" ON public.admin_access_logs;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Error dropping policy on admin_access_logs: %', SQLERRM;
    END;
    
    -- 새 정책 생성
    CREATE POLICY "슈퍼 관리자 로그 접근 정책" ON public.admin_access_logs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.admins 
          WHERE id = auth.uid() AND role = 'superadmin'
        )
      );
  END IF;
END $$;

-- 7. 관리자 목록 확인하기
SELECT * FROM admins;
