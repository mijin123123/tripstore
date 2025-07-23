-- 간단한 예약 테이블 생성 (테스트용)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  package_id TEXT,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  start_date DATE,
  quantity INTEGER DEFAULT 1,
  cost DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  special_requests TEXT,
  people_count INTEGER DEFAULT 1,
  total_price DECIMAL(10,2),
  traveler_info TEXT, -- 간단히 TEXT로 저장
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS 비활성화 (테스트용)
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
