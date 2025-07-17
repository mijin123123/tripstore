-- 회원가입 기능을 위한 데이터베이스 스키마 업데이트

-- 1. 기존 users 테이블에 인증 관련 컬럼 추가
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS phone_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS agree_terms BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS agree_privacy BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS agree_marketing BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20);

-- 2. 이메일 인증 토큰 테이블 생성
CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- 3. 비밀번호 재설정 토큰 테이블 생성
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE
);

-- 4. 사용자 세션 테이블 생성 (선택사항)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ip_address INET,
  user_agent TEXT
);

-- 5. 사용자 로그인 이력 테이블 생성
CREATE TABLE IF NOT EXISTS user_login_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  login_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  failure_reason TEXT
);

-- 6. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_login_history_user_id ON user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_history_login_at ON user_login_history(login_at);

-- 7. 트리거 함수 생성 (updated_at 자동 업데이트)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. 트리거 적용
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Row Level Security (RLS) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;

-- 10. RLS 정책 생성 (기본적인 보안 정책)
-- 기존 정책이 있으면 삭제 후 재생성
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 사용자는 자신의 정보만 볼 수 있음
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- 사용자는 자신의 정보만 업데이트할 수 있음
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- 회원가입 시 누구나 사용자 생성 가능
CREATE POLICY "Anyone can create user" ON users
    FOR INSERT WITH CHECK (true);

-- 이메일 인증 토큰 정책
CREATE POLICY "Users can view own email verification tokens" ON email_verification_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email verification tokens" ON email_verification_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 비밀번호 재설정 토큰 정책
CREATE POLICY "Users can view own password reset tokens" ON password_reset_tokens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own password reset tokens" ON password_reset_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 세션 정책
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 로그인 이력 정책
CREATE POLICY "Users can view own login history" ON user_login_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own login history" ON user_login_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 11. 기본 관리자 계정 생성 (선택사항)
-- INSERT INTO users (email, name, phone, password_hash, email_verified, agree_terms, agree_privacy, status)
-- VALUES ('admin@tripstore.co.kr', '관리자', '010-0000-0000', 'hashed_password_here', true, true, true, 'active');

-- 12. 유용한 뷰 생성
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_users,
    COUNT(CASE WHEN email_verified = true THEN 1 END) as verified_users,
    COUNT(CASE WHEN agree_marketing = true THEN 1 END) as marketing_agreed_users,
    COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as today_signups,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as week_signups,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as month_signups
FROM users;

-- 13. 함수 생성 - 이메일 중복 체크
CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM users WHERE email = email_to_check);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. 함수 생성 - 사용자 통계
CREATE OR REPLACE FUNCTION get_user_login_stats(user_uuid UUID)
RETURNS TABLE (
    total_logins BIGINT,
    last_login TIMESTAMP WITH TIME ZONE,
    failed_attempts BIGINT,
    account_age_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.login_count::BIGINT,
        u.last_login_at,
        COALESCE(failed.count, 0)::BIGINT,
        (EXTRACT(EPOCH FROM (now() - u.created_at)) / 86400)::INTEGER
    FROM users u
    LEFT JOIN (
        SELECT 
            user_id, 
            COUNT(*) as count 
        FROM user_login_history 
        WHERE success = false 
        GROUP BY user_id
    ) failed ON u.id = failed.user_id
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. 토큰 정리를 위한 함수
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS VOID AS $$
BEGIN
    -- 만료된 이메일 인증 토큰 삭제
    DELETE FROM email_verification_tokens 
    WHERE expires_at < now();
    
    -- 만료된 비밀번호 재설정 토큰 삭제
    DELETE FROM password_reset_tokens 
    WHERE expires_at < now();
    
    -- 만료된 세션 삭제
    DELETE FROM user_sessions 
    WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. 토큰 정리 스케줄러 (수동 실행)
-- SELECT cron.schedule('cleanup-expired-tokens', '0 2 * * *', 'SELECT cleanup_expired_tokens();');
