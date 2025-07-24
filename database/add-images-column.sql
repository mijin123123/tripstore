-- packages 테이블에 images 컬럼 추가
ALTER TABLE packages ADD COLUMN IF NOT EXISTS images JSONB;

-- 기존 데이터 업데이트 (image 필드를 images 배열의 첫 번째 요소로 복사)
UPDATE packages 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' THEN jsonb_build_array(image)
  ELSE '[]'::jsonb
END
WHERE images IS NULL;
