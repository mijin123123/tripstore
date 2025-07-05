-- 🚨 단계별 긴급 수정 스크립트
-- 하나씩 실행하세요

-- STEP 1: 테이블 존재 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('packages', 'admins', 'reservations', 'notices');
