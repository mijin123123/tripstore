-- Hero Images Storage 버킷 설정

-- 1. 버킷 생성 (존재하지 않는 경우에만)
INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 버킷에 대한 정책 설정

-- 2-1. 모든 사용자가 파일을 볼 수 있도록 허용 (public read)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'hero-images');

-- 2-2. 인증된 사용자만 파일을 업로드할 수 있도록 허용
CREATE POLICY "Admin can upload hero images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

-- 2-3. 인증된 사용자만 파일을 업데이트할 수 있도록 허용
CREATE POLICY "Admin can update hero images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

-- 2-4. 인증된 사용자만 파일을 삭제할 수 있도록 허용
CREATE POLICY "Admin can delete hero images" ON storage.objects FOR DELETE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

-- 3. RLS(Row Level Security) 활성화
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
