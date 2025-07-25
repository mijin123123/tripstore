-- packages 테이블에 location 컬럼 추가
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS location TEXT;

-- 기존 데이터가 있는 경우를 위한 기본값 설정 (선택사항)
UPDATE packages 
SET location = '미정' 
WHERE location IS NULL;
