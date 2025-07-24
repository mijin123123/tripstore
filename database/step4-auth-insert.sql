-- 4단계: 인증된 사용자 업로드 권한
-- Supabase 대시보드 SQL Editor에서 실행

DROP POLICY IF EXISTS "Authenticated users can insert images" ON storage.objects;

CREATE POLICY "Authenticated users can insert images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');
