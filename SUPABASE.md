# Supabase 데이터베이스 연동 가이드

이 문서는 TripStore 프로젝트에 Supabase를 연동하는 방법을 설명합니다.

## 1. Supabase 계정 생성 및 프로젝트 설정

1. [Supabase 웹사이트](https://supabase.com/)에 접속하여 계정 생성
2. 새 프로젝트 생성 (예: tripstore-db)
3. 프로젝트 생성이 완료되면 대시보드에 접속

## 2. 데이터베이스 스키마 설정

1. SQL 편집기로 이동
2. `database/schema.sql` 파일의 내용을 복사하여 SQL 편집기에 붙여넣기
3. 스크립트 실행하여 테이블 생성

## 3. 환경 변수 설정

1. Supabase 프로젝트 대시보드에서 Settings > API로 이동
2. 다음 값들을 복사:
   - Project URL
   - anon public API key
   - service_role key (데이터 마이그레이션용)
   
3. 프로젝트 루트의 `.env.local` 파일에 다음과 같이 값을 설정:
```
NEXT_PUBLIC_SUPABASE_URL=복사한_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=복사한_ANON_KEY
SUPABASE_SERVICE_KEY=복사한_SERVICE_ROLE_KEY
```

## 4. 데이터 마이그레이션

데이터 마이그레이션을 실행하기 전에 다음 패키지를 설치:

```bash
npm install dotenv
```

마이그레이션 스크립트 실행:

```bash
node scripts/migrate-data.js
```

## 5. 애플리케이션 실행

```bash
npm run dev
```

## 6. 주요 API 함수

`src/lib/api.ts` 파일에 다음과 같은 함수들이 구현되어 있습니다:

- `getAllPackages()`: 모든 패키지 가져오기
- `getPackagesByTypeAndRegion(type, region)`: 특정 타입과 지역의 패키지 가져오기
- `getPackageById(id)`: ID로 패키지 가져오기
- `getAllVillas()`: 모든 빌라 가져오기
- `getVillaById(id)`: ID로 빌라 가져오기
- `createPackage(packageData)`: 새 패키지 추가
- `updatePackage(id, packageData)`: 패키지 업데이트
- `deletePackage(id)`: 패키지 삭제

## 7. 인증 기능 추가 (선택사항)

Supabase는 사용자 인증 기능도 제공합니다. 필요한 경우 다음 패키지를 추가로 설치:

```bash
npm install @supabase/auth-helpers-nextjs
```

인증 관련 API를 구현하려면 `src/lib/auth.ts` 파일을 생성하여 구현할 수 있습니다.
