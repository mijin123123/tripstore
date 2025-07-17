-- 데이터베이스 상태 확인용 쿼리들

-- 1. 현재 리조트 카테고리에 있는 모든 패키지 확인
SELECT id, title, destination, category, created_at 
FROM packages 
WHERE category = '리조트' 
ORDER BY created_at DESC;

-- 2. 베트남/다낭 관련 패키지들의 현재 상태 확인
SELECT id, title, destination, category 
FROM packages 
WHERE destination ILIKE '%베트남%' OR destination ILIKE '%다낭%' OR title ILIKE '%베트남%' OR title ILIKE '%다낭%'
ORDER BY category;

-- 3. 필리핀/세부 관련 패키지들의 현재 상태 확인
SELECT id, title, destination, category 
FROM packages 
WHERE destination ILIKE '%필리핀%' OR destination ILIKE '%세부%' OR title ILIKE '%필리핀%' OR title ILIKE '%세부%'
ORDER BY category;

-- 4. 모든 카테고리별 패키지 수 확인
SELECT category, COUNT(*) as count 
FROM packages 
GROUP BY category 
ORDER BY count DESC;

-- 5. category 컬럼이 NULL인 패키지들 확인
SELECT id, title, destination, category 
FROM packages 
WHERE category IS NULL;
