-- Storage 정책 설정 (한번에 실행)
-- Supabase 대시보드 SQL Editor에서 실행

-- 기존 정책 삭제 (있다면)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;

-- 1. 공개 읽기 정책
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- 2. 인증된 사용자 업로드 정책
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- 3. 인증된 사용자 수정 정책
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images');

-- 4. 인증된 사용자 삭제 정책
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

-- 설정 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;
