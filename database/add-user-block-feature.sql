-- 사용자 테이블에 차단 상태 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- 차단 상태에 대한 인덱스 추가 (선택사항, 성능 향상을 위해)
CREATE INDEX IF NOT EXISTS idx_users_is_blocked ON users(is_blocked);

-- 차단된 사용자 확인을 위한 뷰 생성 (선택사항)
CREATE OR REPLACE VIEW blocked_users AS
SELECT id, email, name, phone, role, created_at, is_blocked
FROM users
WHERE is_blocked = true;

-- 활성 사용자 확인을 위한 뷰 생성 (선택사항)
CREATE OR REPLACE VIEW active_users AS
SELECT id, email, name, phone, role, created_at, is_blocked
FROM users
WHERE is_blocked = false OR is_blocked IS NULL;
