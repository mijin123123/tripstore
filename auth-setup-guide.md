# 회원가입 기능 구현을 위한 패키지 설치

## 필요한 패키지 설치
```bash
npm install bcrypt uuid
npm install -D @types/bcrypt @types/uuid
```

## 설치할 패키지 설명
- **bcrypt**: 비밀번호 해싱을 위한 라이브러리
- **uuid**: 고유한 토큰 생성을 위한 라이브러리
- **@types/bcrypt**: bcrypt의 TypeScript 타입 정의
- **@types/uuid**: uuid의 TypeScript 타입 정의

## 데이터베이스 설정

1. **Supabase 웹 콘솔**에서 SQL Editor를 열고 다음 파일을 실행:
   ```sql
   -- auth-database-setup.sql 파일의 내용을 복사해서 실행
   ```

2. **환경 변수 설정** (.env.local)
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 회원가입 프로세스

### 간소화된 회원가입 (이메일 인증 없음)
1. 사용자가 회원가입 양식 작성
2. 이메일 중복 확인
3. 비밀번호 해싱
4. 사용자 계정 생성 (즉시 활성화)
5. 로그인 페이지로 리다이렉트

### 이메일 인증 (선택사항)
- 이메일 인증 기능은 유지되지만 회원가입 시 필수가 아님
- 나중에 필요시 이메일 인증 토큰 생성 및 인증 가능
- 보안이 중요한 기능 사용 시 이메일 인증 요구 가능

### 회원가입
```typescript
import { AuthService } from '@/lib/auth'

const handleSignup = async (formData) => {
  const { user, error } = await AuthService.signup(formData)
  if (error) {
    console.error('회원가입 실패:', error)
  } else {
    console.log('회원가입 성공:', user)
  }
}
```

### 로그인
```typescript
import { AuthService } from '@/lib/auth'

const handleLogin = async (credentials) => {
  const { user, error } = await AuthService.login(credentials)
  if (error) {
    console.error('로그인 실패:', error)
  } else {
    console.log('로그인 성공:', user)
  }
}
```

### 이메일 인증
```typescript
import { AuthService } from '@/lib/auth'

const handleEmailVerification = async (token) => {
  const { success, error } = await AuthService.verifyEmail(token)
  if (error) {
    console.error('이메일 인증 실패:', error)
  } else {
    console.log('이메일 인증 성공')
  }
}
```

## 보안 고려사항

1. **비밀번호 정책**: 최소 8자, 영문+숫자 포함
2. **토큰 만료**: 이메일 인증 토큰 24시간, 비밀번호 재설정 토큰 1시간
3. **RLS (Row Level Security)**: 사용자는 자신의 데이터만 접근 가능
4. **로그인 시도 기록**: 보안 모니터링을 위한 로그 저장
5. **토큰 정리**: 만료된 토큰 자동 정리

## 추가 구현 필요사항

1. **이메일 발송 서비스**: 이메일 인증 및 비밀번호 재설정 메일 발송
2. **세션 관리**: JWT 토큰 또는 세션 기반 인증
3. **소셜 로그인**: Google, GitHub 등 OAuth 연동
4. **2FA**: 이중 인증 기능
5. **관리자 페이지**: 사용자 관리 및 통계

## 데이터베이스 스키마

### users 테이블
- 기본 정보: id, email, name, phone
- 인증 정보: password_hash, email_verified, phone_verified
- 동의 정보: agree_terms, agree_privacy, agree_marketing
- 상태 정보: status, last_login_at, login_count
- 프로필 정보: profile_image_url, birth_date, gender, address
- 비상 연락처: emergency_contact_name, emergency_contact_phone

### 관련 테이블
- **email_verification_tokens**: 이메일 인증 토큰
- **password_reset_tokens**: 비밀번호 재설정 토큰
- **user_sessions**: 사용자 세션 (선택사항)
- **user_login_history**: 로그인 이력

## 유틸리티 함수

- **check_email_exists()**: 이메일 중복 확인
- **get_user_login_stats()**: 사용자 로그인 통계
- **cleanup_expired_tokens()**: 만료된 토큰 정리

## 뷰 및 통계

- **user_stats**: 사용자 통계 뷰
  - 전체 사용자 수
  - 활성 사용자 수
  - 인증된 사용자 수
  - 마케팅 동의 사용자 수
  - 일별/주별/월별 가입자 수
