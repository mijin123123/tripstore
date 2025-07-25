-- STEP 1: images 버킷 생성
-- Supabase 대시보드의 SQL Editor에서 이 코드를 실행하세요

-- 1. images 버킷 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'Images Bucket',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- 2. Storage objects에 대한 RLS 활성화 확인
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. 공개 읽기 정책
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- 4. 인증된 사용자 업로드 정책
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- 5. 인증된 사용자 수정 정책
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images');

-- 6. 인증된 사용자 삭제 정책
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

-- 7. 생성 확인
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'images';

-- 8. 정책 확인
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND qual LIKE '%images%'
ORDER BY policyname;
