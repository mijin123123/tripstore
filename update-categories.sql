-- 패키지 테이블에 category 컬럼 추가
ALTER TABLE packages ADD COLUMN IF NOT EXISTS category VARCHAR(100);

-- 기존 패키지 데이터에 카테고리 정보 업데이트
-- 목적지 기반으로 카테고리 설정

-- 먼저 모든 패키지의 category를 NULL로 초기화
UPDATE packages SET category = NULL;

-- 1단계: 특수 카테고리 우선 분류 (골프, 크루즈, 이색테마, 럭셔리 에어텔)
-- 골프 패키지 (가장 우선적으로)
UPDATE packages SET category = '골프' 
WHERE title ILIKE '%골프%' OR description ILIKE '%골프%' OR destination ILIKE '%골프%' OR title ILIKE '%golf%' OR description ILIKE '%golf%';

-- 크루즈 (우선 분류)
UPDATE packages SET category = '크루즈' 
WHERE title ILIKE '%크루즈%' OR description ILIKE '%크루즈%' OR title ILIKE '%cruise%' OR description ILIKE '%cruise%';

-- 이색테마 (우선 분류)
UPDATE packages SET category = '이색테마' 
WHERE title ILIKE '%이색%' OR description ILIKE '%이색%' OR title ILIKE '%테마%' OR description ILIKE '%테마%' OR title ILIKE '%특별%' OR description ILIKE '%특별%' OR title ILIKE '%체험%' OR description ILIKE '%체험%' OR title ILIKE '%문화%' OR description ILIKE '%문화%' OR title ILIKE '%역사%' OR description ILIKE '%역사%' OR title ILIKE '%다이빙%' OR description ILIKE '%다이빙%' OR title ILIKE '%스쿠버%' OR description ILIKE '%스쿠버%';

-- 럭셔리 에어텔 (우선 분류)
UPDATE packages SET category = '럭셔리 에어텔' 
WHERE title ILIKE '%에어텔%' OR description ILIKE '%에어텔%' OR (title ILIKE '%럭셔리%' AND (title ILIKE '%항공%' OR title ILIKE '%호텔%')) OR title ILIKE '%프리미엄%항공%' OR description ILIKE '%프리미엄%항공%';

-- 2단계: 지역별 기본 분류 (해외 지역 우선)
-- 유럽 지역
UPDATE packages SET category = '유럽' 
WHERE category IS NULL AND (destination ILIKE '%파리%' OR destination ILIKE '%런던%' OR destination ILIKE '%로마%' OR destination ILIKE '%바르셀로나%' OR destination ILIKE '%독일%' OR destination ILIKE '%프랑스%' OR destination ILIKE '%이탈리아%' OR destination ILIKE '%스페인%' OR destination ILIKE '%영국%' OR destination ILIKE '%유럽%' OR destination ILIKE '%스위스%' OR destination ILIKE '%네덜란드%' OR destination ILIKE '%오스트리아%' OR destination ILIKE '%체코%' OR destination ILIKE '%헝가리%' OR destination ILIKE '%포르투갈%' OR destination ILIKE '%그리스%' OR destination ILIKE '%터키%');

-- 동남아 지역 (베트남, 필리핀 등 명시적으로 포함)
UPDATE packages SET category = '동남아' 
WHERE category IS NULL AND (destination ILIKE '%태국%' OR destination ILIKE '%베트남%' OR destination ILIKE '%싱가포르%' OR destination ILIKE '%말레이시아%' OR destination ILIKE '%인도네시아%' OR destination ILIKE '%필리핀%' OR destination ILIKE '%방콕%' OR destination ILIKE '%호치민%' OR destination ILIKE '%하노이%' OR destination ILIKE '%발리%' OR destination ILIKE '%보라카이%' OR destination ILIKE '%세부%' OR destination ILIKE '%푸켓%' OR destination ILIKE '%랑카위%' OR destination ILIKE '%동남아%' OR destination ILIKE '%다낭%' OR destination ILIKE '%나트랑%' OR destination ILIKE '%코타키나발루%' OR destination ILIKE '%자카르타%' OR destination ILIKE '%캄보디아%' OR destination ILIKE '%앙코르와트%' OR destination ILIKE '%라오스%' OR destination ILIKE '%미얀마%');

-- 일본
UPDATE packages SET category = '일본' 
WHERE category IS NULL AND (destination ILIKE '%일본%' OR destination ILIKE '%도쿄%' OR destination ILIKE '%오사카%' OR destination ILIKE '%교토%' OR destination ILIKE '%후쿠오카%' OR destination ILIKE '%삿포로%' OR destination ILIKE '%나고야%' OR destination ILIKE '%요코하마%' OR destination ILIKE '%고베%' OR destination ILIKE '%나라%' OR destination ILIKE '%니코%' OR destination ILIKE '%가나자와%' OR destination ILIKE '%오키나와%' OR destination ILIKE '%히로시마%' OR destination ILIKE '%센다이%' OR destination ILIKE '%가고시마%' OR destination ILIKE '%구마모토%');

-- 중국
UPDATE packages SET category = '중국' 
WHERE category IS NULL AND (destination ILIKE '%중국%' OR destination ILIKE '%베이징%' OR destination ILIKE '%상하이%' OR destination ILIKE '%시안%' OR destination ILIKE '%청두%' OR destination ILIKE '%광저우%' OR destination ILIKE '%선전%' OR destination ILIKE '%항저우%' OR destination ILIKE '%난징%' OR destination ILIKE '%장가계%' OR destination ILIKE '%하얼빈%' OR destination ILIKE '%대련%' OR destination ILIKE '%천진%' OR destination ILIKE '%쿤밍%' OR destination ILIKE '%홍콩%' OR destination ILIKE '%마카오%');

-- 미주/하와이/중남미
UPDATE packages SET category = '미주/하와이/중남미' 
WHERE category IS NULL AND (destination ILIKE '%미국%' OR destination ILIKE '%캐나다%' OR destination ILIKE '%하와이%' OR destination ILIKE '%뉴욕%' OR destination ILIKE '%로스앤젤레스%' OR destination ILIKE '%라스베가스%' OR destination ILIKE '%샌프란시스코%' OR destination ILIKE '%시애틀%' OR destination ILIKE '%토론토%' OR destination ILIKE '%밴쿠버%' OR destination ILIKE '%브라질%' OR destination ILIKE '%아르헨티나%' OR destination ILIKE '%페루%' OR destination ILIKE '%칠레%' OR destination ILIKE '%멕시코%' OR destination ILIKE '%코스타리카%' OR destination ILIKE '%시카고%' OR destination ILIKE '%보스턴%' OR destination ILIKE '%마이애미%' OR destination ILIKE '%몬트리올%' OR destination ILIKE '%리우데자네이루%' OR destination ILIKE '%부에노스아이레스%' OR destination ILIKE '%리마%' OR destination ILIKE '%산티아고%' OR destination ILIKE '%쿠바%' OR destination ILIKE '%아바나%');

-- 3단계: 국내 지역 분류 (해외 지역이 모두 분류된 후)
UPDATE packages SET category = '국내' 
WHERE category IS NULL AND (destination ILIKE '%서울%' OR destination ILIKE '%부산%' OR destination ILIKE '%제주%' OR destination ILIKE '%강원도%' OR destination ILIKE '%경주%' OR destination ILIKE '%전주%' OR destination ILIKE '%여수%' OR destination ILIKE '%인천%' OR destination ILIKE '%대구%' OR destination ILIKE '%광주%' OR destination ILIKE '%울산%' OR destination ILIKE '%춘천%' OR destination ILIKE '%속초%' OR destination ILIKE '%강릉%' OR destination ILIKE '%평창%' OR destination ILIKE '%설악산%' OR destination ILIKE '%지리산%' OR destination ILIKE '%한라산%' OR destination ILIKE '%대전%' OR destination ILIKE '%청주%' OR destination ILIKE '%천안%' OR destination ILIKE '%수원%' OR destination ILIKE '%안산%' OR destination ILIKE '%고양%' OR destination ILIKE '%성남%' OR destination ILIKE '%용인%' OR destination ILIKE '%부천%' OR destination ILIKE '%안양%' OR destination ILIKE '%남양주%' OR destination ILIKE '%화성%' OR destination ILIKE '%평택%' OR destination ILIKE '%시흥%' OR destination ILIKE '%김포%' OR destination ILIKE '%광명%' OR destination ILIKE '%군포%' OR destination ILIKE '%하남%' OR destination ILIKE '%오산%' OR destination ILIKE '%이천%' OR destination ILIKE '%안성%' OR destination ILIKE '%구리%' OR destination ILIKE '%포천%' OR destination ILIKE '%의정부%' OR destination ILIKE '%동두천%' OR destination ILIKE '%과천%' OR destination ILIKE '%양주%' OR destination ILIKE '%연천%' OR destination ILIKE '%가평%' OR destination ILIKE '%양평%' OR destination ILIKE '%여주%' OR destination ILIKE '%한국%');

-- 4단계: 리조트 및 호텔 카테고리 세분화
-- 풀빌라
UPDATE packages SET category = '풀빌라' 
WHERE (title ILIKE '%풀빌라%' OR description ILIKE '%풀빌라%' OR title ILIKE '%빌라%' OR description ILIKE '%빌라%' OR title ILIKE '%villa%' OR description ILIKE '%villa%') AND category IS NULL;

-- 리조트 분류 (지역별로 이미 분류된 것은 그대로 유지)
UPDATE packages SET category = '리조트' 
WHERE (title ILIKE '%리조트%' OR description ILIKE '%리조트%' OR title ILIKE '%resort%' OR description ILIKE '%resort%') AND category = '국내';

-- 호텔 관련 (기본 호텔로 설정 후 지역별 세분화)
UPDATE packages SET category = '호텔' 
WHERE (title ILIKE '%호텔%' OR description ILIKE '%호텔%' OR title ILIKE '%hotel%' OR description ILIKE '%hotel%') AND category = '국내';

-- 5단계: 하이클래스 카테고리 (럭셔리, 프리미엄 키워드가 있는 패키지들)
UPDATE packages SET category = '하이클래스-유럽' 
WHERE (title ILIKE '%하이클래스%' OR title ILIKE '%럭셔리%' OR title ILIKE '%프리미엄%' OR description ILIKE '%하이클래스%' OR description ILIKE '%럭셔리%' OR description ILIKE '%프리미엄%' OR title ILIKE '%비즈니스%' OR description ILIKE '%비즈니스%') 
AND category = '유럽';

UPDATE packages SET category = '하이클래스-일본' 
WHERE (title ILIKE '%하이클래스%' OR title ILIKE '%럭셔리%' OR title ILIKE '%프리미엄%' OR description ILIKE '%하이클래스%' OR description ILIKE '%럭셔리%' OR description ILIKE '%프리미엄%' OR title ILIKE '%비즈니스%' OR description ILIKE '%비즈니스%') 
AND category = '일본';

-- 6단계: 호텔 카테고리를 지역별로 세분화
UPDATE packages SET category = '호텔-유럽' 
WHERE category = '유럽' AND (title ILIKE '%호텔%' OR description ILIKE '%호텔%' OR title ILIKE '%hotel%' OR description ILIKE '%hotel%');

UPDATE packages SET category = '호텔-동남아' 
WHERE category = '동남아' AND (title ILIKE '%호텔%' OR description ILIKE '%호텔%' OR title ILIKE '%hotel%' OR description ILIKE '%hotel%');

UPDATE packages SET category = '호텔-일본' 
WHERE category = '일본' AND (title ILIKE '%호텔%' OR description ILIKE '%호텔%' OR title ILIKE '%hotel%' OR description ILIKE '%hotel%');

UPDATE packages SET category = '호텔-중국' 
WHERE category = '중국' AND (title ILIKE '%호텔%' OR description ILIKE '%호텔%' OR title ILIKE '%hotel%' OR description ILIKE '%hotel%');

UPDATE packages SET category = '호텔-미주/하와이/중남미' 
WHERE category = '미주/하와이/중남미' AND (title ILIKE '%호텔%' OR description ILIKE '%호텔%' OR title ILIKE '%hotel%' OR description ILIKE '%hotel%');

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_destination ON packages(destination);
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);
