-- 필요한 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 패키지 테이블 생성
CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  destination TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discountprice DECIMAL(10, 2),
  duration INTEGER,
  departuredate TEXT[] NOT NULL,
  images TEXT[] NOT NULL,
  rating DECIMAL(2, 1),
  reviewcount INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  season TEXT,
  inclusions TEXT[],
  exclusions TEXT[],
  isfeatured BOOLEAN DEFAULT false,
  isonsale BOOLEAN DEFAULT false,
  itinerary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS(Row Level Security) 정책 설정
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- 익명 사용자는 읽기만 가능하도록 설정
CREATE POLICY "익명 사용자 읽기 권한" ON packages
  FOR SELECT USING (true);

-- 관리자 테이블 생성
CREATE TABLE admins (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 관리자만 추가/수정/삭제 가능하도록 설정
CREATE POLICY "관리자 전체 권한" ON packages
  FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins));

-- 예약 테이블 생성
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  departure_date TEXT NOT NULL,
  travelers INTEGER NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_status TEXT NOT NULL DEFAULT 'unpaid',
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 리뷰 테이블 생성
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 공지사항 테이블 생성
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 공지사항은 모든 사용자가 읽을 수 있음
CREATE POLICY "공지사항 읽기 권한" ON notices
  FOR SELECT USING (true);

-- 사용자는 자신의 예약만 볼 수 있음
CREATE POLICY "사용자 예약 읽기 권한" ON reservations
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 리뷰만 볼 수 있음
CREATE POLICY "사용자 리뷰 읽기 권한" ON reviews
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 리뷰만 수정/삭제할 수 있음
CREATE POLICY "사용자 리뷰 수정 권한" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "사용자 리뷰 삭제 권한" ON reviews
  FOR DELETE USING (auth.uid() = user_id);
