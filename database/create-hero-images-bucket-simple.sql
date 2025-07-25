-- 간단한 Hero Images 버킷 생성 스크립트

-- 버킷 생성 (존재하지 않는 경우에만)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- 생성된 버킷 확인
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'hero-images';
