-- Supabase Storage 버킷 및 정책 설정
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. 'images' 버킷 생성 (이미 존재한다면 무시됨)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage objects에 대한 RLS 활성화 (이미 활성화되어 있을 수 있음)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. 읽기 권한 정책 (모든 사용자가 이미지를 볼 수 있음)
CREATE POLICY "Public Access to images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- 4. 삽입 권한 정책 (인증된 사용자만 업로드 가능)
CREATE POLICY "Authenticated users can insert images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images');

-- 5. 업데이트 권한 정책 (인증된 사용자만 수정 가능)
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images');

-- 6. 삭제 권한 정책 (인증된 사용자만 삭제 가능)
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images');

-- 설정 확인
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'images';

-- 정책 확인
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
