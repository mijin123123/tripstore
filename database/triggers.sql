-- Supabase의 Auth 시스템과 users 테이블 간의 자동 동기화를 위한 트리거
-- 이 트리거는 auth.users 테이블에 사용자가 추가되거나 업데이트될 때마다 
-- public.users 테이블에 자동으로 해당 사용자 정보를 추가 또는 업데이트합니다.

-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- auth.users에서 사용자가 추가되었을 때 public.users에도 추가
  INSERT INTO public.users(id, email, name, phone, is_admin, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    false,
    NEW.created_at,
    NEW.updated_at
  )
  -- 이미 존재하는 경우 업데이트
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- 오류 로깅
    RAISE NOTICE 'Error syncing user to public.users: %', SQLERRM;
    RETURN NEW; -- 인증 프로세스를 중단하지 않기 위해 new를 반환
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 트리거가 있다면 삭제
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- auth.users 테이블에 새 트리거 생성 (추가와 업데이트 모두 처리)
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 권한 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "사용자는 자신의 데이터만 볼 수 있음" ON public.users;
DROP POLICY IF EXISTS "사용자는 자신의 데이터만 업데이트할 수 있음" ON public.users;
DROP POLICY IF EXISTS "관리자는 모든 사용자 데이터를 볼 수 있음" ON public.users;
DROP POLICY IF EXISTS "관리자는 모든 사용자 데이터를 업데이트할 수 있음" ON public.users;
DROP POLICY IF EXISTS "모든 사용자는 자신의 데이터에 접근할 수 있음" ON public.users;
DROP POLICY IF EXISTS "기본 정책" ON public.users;
DROP POLICY IF EXISTS "읽기 정책" ON public.users;
DROP POLICY IF EXISTS "쓰기 정책" ON public.users;

-- 첫 번째 관리자 사용자 설정 (sosing899@gmail.com을 관리자로 설정)
UPDATE public.users SET is_admin = true WHERE email = 'sosing899@gmail.com';

-- 무한 재귀를 피하기 위한 단순한 RLS 정책
-- 모든 요청에 대해 true를 반환하는 단순 정책 추가
CREATE POLICY "기본 액세스 정책" ON public.users
  FOR ALL USING (true);

-- 참고: 보안을 위해서는 API 엔드포인트에서 서비스 역할(service role)을 통해
-- 권한 제어를 구현하는 것이 좋습니다. 클라이언트에서는 데이터를 읽기만 하고
-- 쓰기 작업은 서버 API를 통해서만 수행하도록 구현하세요.
