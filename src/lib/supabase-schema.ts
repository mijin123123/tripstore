/**
 * Supabase 데이터베이스 스키마 정의
 * 
 * 이 파일은 Supabase에서 테이블을 생성할 때 사용할 수 있는 스키마 정의입니다.
 * SQL 쿼리로 변환하여 Supabase SQL 에디터에서 실행할 수 있습니다.
 */

/*
테이블: packages (여행 패키지)

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  destination TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discountPrice DECIMAL(10, 2),
  duration INTEGER NOT NULL,
  departureDate TEXT[] NOT NULL,
  images TEXT[] NOT NULL,
  rating DECIMAL(2, 1),
  reviewCount INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  season TEXT,
  inclusions TEXT[],
  exclusions TEXT[],
  isFeatured BOOLEAN DEFAULT false,
  isOnSale BOOLEAN DEFAULT false,
  itinerary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS(Row Level Security) 정책 설정
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- 익명 사용자는 읽기만 가능하도록 설정
CREATE POLICY "익명 사용자 읽기 권한" ON packages
  FOR SELECT USING (true);

-- 관리자만 추가/수정/삭제 가능하도록 설정
CREATE POLICY "관리자 전체 권한" ON packages
  FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins));
*/

/*
테이블: users (사용자)

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 자신의 데이터만 읽을 수 있음
CREATE POLICY "사용자 자신의 데이터 읽기" ON users
  FOR SELECT USING (auth.uid() = id);

-- 자신의 데이터만 수정할 수 있음
CREATE POLICY "사용자 자신의 데이터 수정" ON users
  FOR UPDATE USING (auth.uid() = id);
*/

/*
테이블: reservations (예약)

CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  reservation_code TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  travelers INTEGER NOT NULL,
  departure_date DATE NOT NULL,
  special_requests TEXT,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 자신의 예약만 읽을 수 있음
CREATE POLICY "사용자 자신의 예약 읽기" ON reservations
  FOR SELECT USING (auth.uid() = user_id);

-- 자신의 예약만 수정할 수 있음
CREATE POLICY "사용자 자신의 예약 수정" ON reservations
  FOR UPDATE USING (auth.uid() = user_id);

-- 자신의 예약만 생성할 수 있음
CREATE POLICY "사용자 자신의 예약 생성" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 관리자는 모든 예약을 볼 수 있음
CREATE POLICY "관리자 예약 읽기 권한" ON reservations
  FOR SELECT USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins));

-- 관리자는 모든 예약을 수정할 수 있음
CREATE POLICY "관리자 예약 수정 권한" ON reservations
  FOR UPDATE USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins));
*/

/*
테이블: reviews (리뷰)

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 리뷰를 읽을 수 있음
CREATE POLICY "모든 사용자 리뷰 읽기" ON reviews
  FOR SELECT USING (true);

-- 자신의 리뷰만 수정할 수 있음
CREATE POLICY "사용자 자신의 리뷰 수정" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- 자신의 리뷰만 삭제할 수 있음
CREATE POLICY "사용자 자신의 리뷰 삭제" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- 예약한 상품에 대해서만 리뷰를 작성할 수 있음
CREATE POLICY "예약한 상품만 리뷰 작성" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM reservations
      WHERE user_id = auth.uid() AND
            package_id = reviews.package_id AND
            status = 'completed'
    )
  );
*/

/*
테이블: notices (공지사항)

CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 공지사항을 읽을 수 있음
CREATE POLICY "모든 사용자 공지사항 읽기" ON notices
  FOR SELECT USING (true);

-- 관리자만 공지사항을 추가/수정/삭제할 수 있음
CREATE POLICY "관리자 공지사항 권한" ON notices
  FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins));
*/

/*
테이블: admins (관리자)

CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 관리자만 관리자 목록을 볼 수 있음
CREATE POLICY "관리자만 관리자 목록 읽기" ON admins
  FOR SELECT USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins));

-- 슈퍼 관리자만 관리자를 추가/수정/삭제할 수 있음
CREATE POLICY "슈퍼 관리자 권한" ON admins
  FOR ALL USING (auth.role() = 'authenticated' AND auth.email() IN (SELECT email FROM admins WHERE role = 'super_admin'));
*/
