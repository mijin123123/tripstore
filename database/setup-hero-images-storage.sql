-- Hero Images Storage 버킷 설정

-- 1. 버킷 생성 (존재하지 않는 경우에만)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- 주의: 아래 정책들은 Supabase 대시보드에서 설정하는 것을 권장합니다.
-- SQL Editor에서 실행 시 권한 오류가 발생할 수 있습니다.

-- 대신 아래 설정을 Supabase 대시보드에서 진행해주세요:
-- 
-- Storage > hero-images > Policies 에서 다음 정책들을 추가:
-- 
-- 1. Public Read Policy:
--    Policy name: Public Access
--    Allowed operation: SELECT
--    Target roles: public
--    USING expression: bucket_id = 'hero-images'
--
-- 2. Admin Upload Policy:
--    Policy name: Admin Upload
--    Allowed operation: INSERT
--    Target roles: authenticated
--    WITH CHECK expression: bucket_id = 'hero-images'
--
-- 3. Admin Update Policy:
--    Policy name: Admin Update
--    Allowed operation: UPDATE
--    Target roles: authenticated
--    USING expression: bucket_id = 'hero-images'
--
-- 4. Admin Delete Policy:
--    Policy name: Admin Delete
--    Allowed operation: DELETE
--    Target roles: authenticated
--    USING expression: bucket_id = 'hero-images'

-- 버킷 생성 확인 쿼리
SELECT * FROM storage.buckets WHERE id = 'hero-images';
