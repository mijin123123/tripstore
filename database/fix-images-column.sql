-- Supabase 대시보드의 SQL Editor에서 실행할 스크립트

-- 1. packages 테이블에 images 컬럼 추가
ALTER TABLE packages ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- 2. 기존 데이터 확인
SELECT id, title, 
       CASE WHEN image IS NOT NULL AND image != '' THEN 'Has main image' ELSE 'No main image' END as main_image_status,
       CASE WHEN images IS NOT NULL THEN 'Has images array' ELSE 'No images array' END as images_array_status
FROM packages 
WHERE id = 'OVE-EU-514125';

-- 3. 기존 image 필드를 images 배열로 복사 (image가 있는 경우에만)
UPDATE packages 
SET images = jsonb_build_array(image)
WHERE image IS NOT NULL 
  AND image != '' 
  AND (images IS NULL OR images = '[]'::jsonb);

-- 4. 업데이트 결과 확인
SELECT id, title, 
       length(image) as image_length,
       images,
       jsonb_array_length(images) as images_count
FROM packages 
WHERE id = 'OVE-EU-514125';
