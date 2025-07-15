# Supabase 설정 가이드

## 1. Supabase 프로젝트 생성

### 1-1. 계정 생성 및 프로젝트 설정
1. [Supabase](https://supabase.com)에 접속하여 계정 생성
2. "New Project" 클릭
3. Organization 선택 (없으면 새로 생성)
4. 프로젝트 정보 입력:
   - **Name**: tripstore
   - **Database Password**: 강력한 비밀번호 설정
   - **Region**: Asia Northeast (Seoul) - 한국 사용자에게 최적
5. "Create new project" 클릭

### 1-2. 환경변수 확인
프로젝트 생성 후 Settings → API에서 다음 정보 확인:
- **URL**: https://your-project-id.supabase.co
- **anon key**: 공개 키 (클라이언트에서 사용)
- **service_role key**: 서비스 키 (서버에서 사용, 비공개)

## 2. 데이터베이스 스키마 생성

### 2-1. SQL Editor에서 스키마 생성
1. Supabase 대시보드에서 "SQL Editor" 클릭
2. "New query" 클릭
3. `supabase-schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 클릭하여 실행

### 2-2. 테스트 데이터 삽입
1. 새로운 쿼리 생성
2. `supabase-test-data.sql` 파일의 내용을 복사하여 붙여넣기
3. "Run" 클릭하여 실행

## 3. 환경변수 설정

### 3-1. 로컬 개발 환경 (.env.local)
```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-for-tripstore-app-1325506129

# 이미지 최적화
NEXT_PUBLIC_ALLOWED_DOMAINS=images.unsplash.com,randomuser.me,upload.wikimedia.org
NEXT_IMAGE_DOMAINS=images.unsplash.com,randomuser.me,upload.wikimedia.org
NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION=true
```

### 3-2. Netlify 배포 환경
Netlify 대시보드 → Site settings → Environment variables에서 설정:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

## 4. 테이블 구조

### 4-1. users (사용자)
- `id`: UUID (기본키)
- `email`: VARCHAR(255) (유니크)
- `password_hash`: TEXT
- `name`: VARCHAR(255)
- `role`: VARCHAR(20) ('user' | 'admin')
- `created_at`, `updated_at`: TIMESTAMP

### 4-2. packages (패키지)
- `id`: UUID (기본키)
- `title`: VARCHAR(255)
- `description`: TEXT
- `price`: DECIMAL(10,2)
- `duration`: VARCHAR(100)
- `location`: VARCHAR(255)
- `image_url`: TEXT
- `category`: VARCHAR(100)
- `created_at`, `updated_at`: TIMESTAMP

### 4-3. reservations (예약)
- `id`: UUID (기본키)
- `user_id`: UUID (외래키 → users.id)
- `package_id`: UUID (외래키 → packages.id)
- `start_date`: DATE
- `end_date`: DATE
- `travelers`: INTEGER
- `total_price`: DECIMAL(10,2)
- `status`: VARCHAR(20) ('pending' | 'confirmed' | 'cancelled')
- `created_at`, `updated_at`: TIMESTAMP

## 5. Row Level Security (RLS)

### 5-1. 기본 정책
- **packages**: 모든 사용자가 읽기 가능
- **notices**: 모든 사용자가 읽기 가능
- **reviews**: 모든 사용자가 읽기 가능

### 5-2. 제한 정책
- **users**: 사용자 자신의 정보만 읽기 가능
- **reservations**: 사용자 자신의 예약만 읽기/생성 가능
- **reviews**: 사용자 자신의 후기만 생성 가능

## 6. 테스트 사용자

스키마 생성 후 다음 테스트 사용자들이 생성됩니다:

### 6-1. 일반 사용자
- **이메일**: test@example.com
- **비밀번호**: test123
- **역할**: user

### 6-2. 관리자
- **이메일**: admin@tripstore.com
- **비밀번호**: admin123
- **역할**: admin

## 7. API 테스트

### 7-1. Health Check
```
GET /api/health
```
Supabase 연결 상태를 확인합니다.

### 7-2. 로그인 테스트
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

## 8. Supabase 대시보드 활용

### 8-1. Table Editor
- 데이터 직접 확인/수정 가능
- 실시간 데이터 동기화

### 8-2. Authentication
- 사용자 관리 (선택사항)
- 소셜 로그인 설정 (선택사항)

### 8-3. Storage
- 이미지 파일 업로드 (선택사항)
- CDN 기능

## 9. 문제 해결

### 9-1. 연결 오류
- 환경변수 이름 정확히 확인
- Supabase URL과 키 정확성 확인
- 네트워크 방화벽 설정 확인

### 9-2. RLS 정책 오류
- Supabase 대시보드에서 정책 확인
- 서비스 키 사용 여부 확인

### 9-3. 비밀번호 해시 오류
- bcryptjs 패키지 설치 확인
- 비밀번호 해시 형식 확인

## 10. 장점

- **무료 시작**: 월 500MB DB, 50MB 파일 저장소
- **실시간 동기화**: PostgreSQL 변경사항 실시간 반영
- **내장 인증**: 소셜 로그인, 이메일 인증 등
- **자동 API 생성**: REST API 자동 생성
- **타입 안전성**: TypeScript 지원
- **확장성**: 서버리스 환경에 최적화

## 11. 다음 단계

1. Supabase 프로젝트 생성
2. 스키마 및 테스트 데이터 삽입
3. 환경변수 설정
4. 로컬에서 테스트
5. Netlify에 배포
