-- 첫 번째 관리자 사용자 설정 스크립트
-- Supabase SQL 에디터에서 실행하세요

-- 특정 사용자를 관리자로 설정 (이메일 주소 변경 필요)
UPDATE public.users SET is_admin = true 
WHERE email = 'sosing899@gmail.com';

-- 업데이트된 관리자 확인
SELECT id, email, name, is_admin FROM public.users WHERE is_admin = true;
