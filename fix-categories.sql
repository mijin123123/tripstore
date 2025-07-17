-- 국내 리조트 카테고리에 잘못 분류된 해외 패키지들을 올바른 카테고리로 이동
-- 베트남 다낭이나 필리핀 등 해외 패키지가 잘못 분류된 경우 수정

-- 1. 리조트 카테고리에 있는 베트남/다낭 패키지를 골프 또는 동남아로 이동
UPDATE packages SET category = '골프' 
WHERE category = '리조트' 
AND destination ILIKE '%다낭%' 
AND (title ILIKE '%골프%' OR description ILIKE '%골프%');

UPDATE packages SET category = '동남아' 
WHERE category = '리조트' 
AND (destination ILIKE '%베트남%' OR destination ILIKE '%다낭%');

-- 2. 리조트 카테고리에 있는 필리핀/세부 패키지를 동남아로 이동
UPDATE packages SET category = '동남아' 
WHERE category = '리조트' 
AND (destination ILIKE '%필리핀%' OR destination ILIKE '%세부%');

-- 3. 기타 해외 패키지들을 적절한 카테고리로 이동
UPDATE packages SET category = '동남아' 
WHERE category = '리조트' 
AND (destination ILIKE '%태국%' OR destination ILIKE '%말레이시아%' OR destination ILIKE '%인도네시아%' OR destination ILIKE '%싱가포르%');

UPDATE packages SET category = '일본' 
WHERE category = '리조트' 
AND destination ILIKE '%일본%';

UPDATE packages SET category = '중국' 
WHERE category = '리조트' 
AND destination ILIKE '%중국%';

UPDATE packages SET category = '미주/하와이/중남미' 
WHERE category = '리조트' 
AND (destination ILIKE '%미국%' OR destination ILIKE '%하와이%' OR destination ILIKE '%캐나다%');

UPDATE packages SET category = '유럽' 
WHERE category = '리조트' 
AND destination ILIKE '%유럽%';

-- 4. 확인용: 리조트 카테고리에 남아있는 패키지들 조회 (실행 후 확인용)
-- SELECT title, destination, category FROM packages WHERE category = '리조트';
