-- STEP 2: packages 테이블 생성
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    available_dates TEXT,
    description TEXT,
    includes TEXT,
    excludes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 비활성화
ALTER TABLE packages DISABLE ROW LEVEL SECURITY;
