-- RLS 일시적으로 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;

-- 마이그레이션 후 다시 활성화하려면:
-- ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
