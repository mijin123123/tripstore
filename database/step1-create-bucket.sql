-- 1단계: Storage 버킷 생성
-- Supabase 대시보드 SQL Editor에서 실행

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 결과 확인
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE id = 'images';
