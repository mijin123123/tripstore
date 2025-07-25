-- Hero Images Storage 완전 설정 (RLS 정책 포함)

-- 1. 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'hero-images', 
  'hero-images', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- 2. 기존 정책 삭제 (중복 방지)
DROP POLICY IF EXISTS "Public Access for hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload for hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update for hero-images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete for hero-images" ON storage.objects;

-- 3. Public Read 정책 생성
CREATE POLICY "Public Access for hero-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'hero-images');

-- 4. Authenticated Upload 정책 생성
CREATE POLICY "Admin Upload for hero-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'hero-images');

-- 5. Authenticated Update 정책 생성
CREATE POLICY "Admin Update for hero-images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'hero-images');

-- 6. Authenticated Delete 정책 생성
CREATE POLICY "Admin Delete for hero-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'hero-images');

-- 7. RLS 활성화
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 8. 확인 쿼리
SELECT 'Bucket Info:' as type, id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets WHERE id = 'hero-images'

UNION ALL

SELECT 'Policy Info:' as type, policyname::text, cmd::text, roles::text, qual::text, ''::text[]
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname LIKE '%hero-images%';

-- 성공 메시지
SELECT 'Hero Images Storage setup completed with RLS policies!' as result;
