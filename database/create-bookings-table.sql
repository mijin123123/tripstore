-- 예약 테이블 생성
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id TEXT REFERENCES packages(id) ON DELETE SET NULL,
  villa_id TEXT,
  booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  start_date DATE,
  end_date DATE,
  quantity INTEGER DEFAULT 1,
  cost DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  special_requests TEXT,
  people_count INTEGER DEFAULT 1,
  total_price DECIMAL(10,2),
  traveler_info JSONB, -- 여행자 정보를 JSON으로 저장
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_package_id ON bookings(package_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);

-- 업데이트 트리거 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 관리자는 모든 예약을 볼 수 있음
CREATE POLICY "관리자는 모든 예약 조회 가능" ON bookings
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- 사용자는 자신의 예약만 볼 수 있음
CREATE POLICY "사용자는 자신의 예약만 조회 가능" ON bookings
FOR SELECT USING (user_id = auth.uid());

-- 예약 생성은 누구나 가능 (임시 - 실제로는 인증된 사용자만)
CREATE POLICY "예약 생성 허용" ON bookings
FOR INSERT WITH CHECK (true);

-- 관리자는 모든 예약을 수정할 수 있음
CREATE POLICY "관리자는 모든 예약 수정 가능" ON bookings
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);

-- 사용자는 자신의 예약만 수정할 수 있음 (취소 등)
CREATE POLICY "사용자는 자신의 예약만 수정 가능" ON bookings
FOR UPDATE USING (user_id = auth.uid());
