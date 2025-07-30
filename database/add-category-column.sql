-- packages 테이블에 category 컬럼 추가
ALTER TABLE packages ADD COLUMN IF NOT EXISTS category TEXT;

-- 기존 데이터를 위한 category 값 업데이트 (type과 region 기반)
UPDATE packages 
SET category = CASE 
  WHEN type = 'overseas' AND region = 'europe' THEN 'overseas-europe'
  WHEN type = 'overseas' AND region = 'japan' THEN 'overseas-japan'
  WHEN type = 'overseas' AND region = 'southeast-asia' THEN 'overseas-southeast-asia'
  WHEN type = 'overseas' AND region = 'americas' THEN 'overseas-americas'
  WHEN type = 'overseas' AND region = 'taiwan-hongkong-macau' THEN 'overseas-taiwan-hongkong-macau'
  WHEN type = 'overseas' AND region = 'guam-saipan' THEN 'overseas-guam-saipan'
  WHEN type = 'domestic' AND region = 'hotel' THEN 'domestic-hotel'
  WHEN type = 'domestic' AND region = 'pool-villa' THEN 'domestic-pool-villa'
  WHEN type = 'luxury' AND region = 'europe' THEN 'luxury-europe'
  WHEN type = 'luxury' AND region = 'japan' THEN 'luxury-japan'
  WHEN type = 'luxury' AND region = 'southeast-asia' THEN 'luxury-southeast-asia'
  WHEN type = 'luxury' AND region = 'cruise' THEN 'luxury-cruise'
  WHEN type = 'luxury' AND region = 'special-theme' THEN 'luxury-special-theme'
  ELSE CONCAT(type, '-', region)
END
WHERE category IS NULL;
