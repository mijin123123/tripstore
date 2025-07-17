# TripStore - 해외여행 여행사 사이트

TripStore는 해외여행 전문 여행사 웹사이트입니다. 사용자들이 다양한 해외여행 패키지를 검색하고 예약할 수 있는 모던하고 직관적인 플랫폼을 제공합니다.

## 🌐 라이브 데모

- **배포 URL**: [🚀 TripStore 사이트](https://tripstore.netlify.app)
- **GitHub Repository**: [https://github.com/trip1235/trip](https://github.com/trip1235/trip)
- **배포 상태**: ✅ 배포 완료 및 정상 작동 중

## 주요 기능

### 🌍 여행 패키지 검색
- 목적지별 여행 패키지 검색
- 날짜 및 인원 선택
- 다양한 필터 옵션 (가격, 기간, 평점, 특징)
- 정렬 기능 (인기순, 가격순, 평점순)

### 📦 패키지 상세 정보
- 상세한 여행 일정 및 포함사항
- 고화질 이미지 갤러리
- 실시간 예약 시스템
- 리뷰 및 평점 시스템

### 🎨 사용자 경험
- 반응형 디자인 (모바일, 태블릿, 데스크톱)
- 직관적인 사용자 인터페이스
- 빠른 로딩 속도
- 접근성 최적화

### 🛡️ 신뢰성
- 안전한 결제 시스템
- 24시간 고객 지원
- 여행자 보험 포함
- 무료 취소 정책

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Development**: ESLint, PostCSS, Autoprefixer

## 프로젝트 구조

```
tripstore/
├── app/
│   ├── globals.css          # 전역 스타일
│   ├── layout.tsx           # 메인 레이아웃
│   ├── page.tsx             # 홈페이지
│   ├── search/
│   │   └── page.tsx         # 검색 결과 페이지
│   └── package/
│       └── page.tsx         # 패키지 상세 페이지
├── public/                  # 정적 파일
├── next.config.js           # Next.js 설정
├── tailwind.config.js       # Tailwind CSS 설정
├── tsconfig.json            # TypeScript 설정
└── package.json             # 프로젝트 의존성
```

## 시작하기

### 필요 조건
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 실행**
```bash
npm run dev
```

3. **브라우저에서 확인**
```
http://localhost:3000
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 페이지 구성

### 홈페이지 (`/`)
- 히어로 섹션과 검색 폼
- 인기 여행 패키지 섹션
- 서비스 특징 소개
- 푸터

### 검색 결과 페이지 (`/search`)
- 검색 필터 사이드바
- 여행 패키지 목록
- 정렬 및 페이지네이션
- 검색 결과 통계

### 패키지 상세 페이지 (`/package`)
- 이미지 갤러리
- 상세 정보 탭 (개요, 일정, 포함사항, 리뷰)
- 예약 사이드바
- 가격 정보 및 할인

## 주요 컴포넌트

### 검색 기능
- 목적지 검색
- 날짜 선택
- 인원 선택
- 필터링 옵션

### 패키지 카드
- 이미지 썸네일
- 기본 정보 (제목, 위치, 기간)
- 가격 및 할인 정보
- 평점 및 리뷰 수
- 특징 태그

### 예약 시스템
- 실시간 가격 계산
- 출발일 선택
- 인원 선택
- 예약 확인

## 스타일링

### Tailwind CSS 설정
- 커스텀 컬러 팔레트
- 반응형 브레이크포인트
- 유틸리티 클래스

### 디자인 시스템
- 일관된 색상 체계
- 타이포그래피 스케일
- 그림자 및 애니메이션

## 개발 가이드

### 코드 스타일
- TypeScript 엄격 모드
- ESLint 규칙 준수
- 컴포넌트 기반 개발

### 상태 관리
- React useState 훅
- 로컬 상태 관리
- 폼 상태 처리

### 성능 최적화
- Next.js 이미지 최적화
- 컴포넌트 지연 로딩
- CSS 최적화

## 🚀 배포 & 데이터베이스

### 배포 플랫폼: Netlify
- **배포 URL**: [https://tripstore.netlify.app](https://tripstore.netlify.app)
- **자동 배포**: GitHub 연동으로 자동 배포 설정
- **빌드 설정**: `netlify.toml` 파일로 관리
- **배포 상태**: ✅ 성공적으로 배포 완료

### 데이터베이스: Supabase
- **현재 상태**: 🔄 연동 진행 중
- **기능 구현**: 
  - ✅ Supabase 클라이언트 설정 완료
  - ✅ 데이터베이스 스키마 및 샘플 데이터 준비
  - ✅ API 유틸리티 구현 (데모 데이터 fallback 포함)
  - ✅ 모든 페이지에 Supabase 연동 적용
  - ✅ 사용자 인증 시스템 구현
- **주요 테이블**: packages, reservations
- **실시간 기능**: 실시간 데이터 로딩 및 업데이트
- **인증**: Supabase Auth를 통한 사용자 인증

### 구현된 기능
1. **데이터 연동**
   - ✅ 메인 페이지: 인기 패키지 실시간 로딩
   - ✅ 검색 페이지: 전체 패키지 목록 및 필터링
   - ✅ 패키지 상세 페이지: 개별 패키지 정보 로딩
   - ✅ 환경 변수 미설정 시 데모 데이터 사용

2. **사용자 인증**
   - ✅ 로그인/회원가입 모달 구현
   - ✅ 인증 상태 관리 (useEffect + onAuthStateChange)
   - ✅ 로그인 후 예약 버튼 활성화
   - ✅ 모든 페이지에 인증 상태 표시

3. **사용자 경험**
   - ✅ 로딩 상태 표시
   - ✅ 에러 처리 및 fallback
   - ✅ 반응형 디자인 유지
   - ✅ 일관된 네비게이션

### 설정 방법
1. **Supabase 프로젝트 생성**
   ```bash
   # 1. https://supabase.com 접속
   # 2. 새 프로젝트 생성
   # 3. 데이터베이스 비밀번호 설정
   # 4. 프로젝트 URL 및 API 키 복사
   ```

2. **환경 변수 설정**
   ```bash
   # .env.local 파일 수정
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```

3. **데이터베이스 스키마 실행**
   ```bash
   # Supabase SQL Editor에서 database/schema.sql 실행
   # 테이블 생성, 샘플 데이터 삽입, RLS 정책 설정
   ```

### 배포 프로세스
1. **Phase 1**: 정적 사이트 Netlify 배포 ✅
2. **Phase 2**: Supabase 데이터베이스 연동 ✅
3. **Phase 3**: 사용자 인증 시스템 구현 ✅
4. **Phase 4**: 실시간 예약 시스템 구축 (다음 단계)
5. **Phase 5**: 결제 시스템 연동 (향후 계획)

## 🔧 Supabase 설정 가이드

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 생성 완료 후 URL과 API Key 확인

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 값들을 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. 데이터베이스 스키마 생성
Supabase SQL Editor에서 `database/schema.sql` 파일의 내용을 실행하세요:

- 테이블 생성 (packages, reservations)
- 샘플 데이터 삽입
- 인덱스 및 보안 정책 설정

### 4. 데이터베이스 구조
```sql
-- packages 테이블
id (UUID, Primary Key)
title (VARCHAR)
location (VARCHAR)
price (INTEGER)
original_price (INTEGER)
duration (VARCHAR)
description (TEXT)
highlights (TEXT[])
images (TEXT[])
rating (DECIMAL)
reviews (INTEGER)
departure_date (DATE)
available_spots (INTEGER)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)

-- reservations 테이블
id (UUID, Primary Key)
package_id (UUID, Foreign Key)
user_email (VARCHAR)
travelers (INTEGER)
departure_date (DATE)
total_price (INTEGER)
status (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## 향후 개발 계획

### 즉시 진행 가능한 기능
- [x] 사용자 인증 시스템 ✅
- [x] 데이터베이스 연동 ✅
- [ ] 실제 예약 시스템 구현
- [ ] 예약 관리 및 상태 업데이트
- [ ] 사용자 프로필 페이지

### 단기 계획 (1-2주)
- [ ] 실시간 예약 처리 시스템
- [ ] 예약 확인 및 취소 기능
- [ ] 이메일 알림 시스템
- [ ] 리뷰 및 평점 시스템
- [ ] 위시리스트 기능

### 중기 계획 (1-2개월)
- [ ] 결제 시스템 연동 (Stripe/PG사)
- [ ] 관리자 대시보드
- [ ] 고급 검색 및 필터링
- [ ] 추천 시스템
- [ ] 모바일 앱 개발

### 장기 계획 (3-6개월)
- [ ] 다국어 지원 (영어, 중국어, 일본어)
- [ ] AI 기반 여행 추천
- [ ] 소셜 로그인 (Google, 카카오, 네이버)
- [ ] PWA 기능 추가
- [ ] 성능 최적화 및 CDN 적용

### 기술 개선
- [x] API 서버 구축 (Supabase) ✅
- [x] 상태 관리 시스템 (React hooks) ✅
- [ ] 테스트 코드 작성 (Jest, Testing Library)
- [ ] CI/CD 파이프라인 구축
- [ ] 모니터링 및 로깅 시스템

### UI/UX 개선
- [ ] 다크 모드 지원
- [ ] 애니메이션 추가 (Framer Motion)
- [ ] 접근성 향상 (ARIA, Screen Reader)
- [ ] 로딩 스켈레톤 개선
- [ ] 에러 바운더리 구현

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 문의사항

프로젝트에 대한 문의나 제안사항이 있으시면 언제든지 연락주세요.

---

**TripStore** - 세계 어디든, 특별한 여행을 시작하세요! 🌍✈️
