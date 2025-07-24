-- 3단계: 읽기 권한 정책 (모든 사용자가 이미지를 볼 수 있음)
-- Supabase 대시보드 SQL Editor에서 실행

DROP POLICY IF EXISTS "Public Access to images" ON storage.objects;

CREATE POLICY "Public Access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');
