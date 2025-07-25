# 프로젝트에서 Auth와 데이터베이스 연동 방법

## 1. 문제 상황

회원가입 시 사용자가 Supabase Auth에는 등록되지만 실제 데이터베이스의 `users` 테이블에는 추가되지 않는 문제가 발생했습니다.

## 2. 해결 방법

### 2.1. 데이터베이스 트리거 설정

Supabase SQL 에디터에서 다음 코드를 실행하세요. 이 코드는 Auth 시스템에 사용자가 등록될 때 자동으로 `users` 테이블에도 동일한 사용자를 추가합니다:

```sql
-- 트리거 SQL 코드는 database/triggers.sql 파일을 참조하세요
```

### 2.2. 기존 사용자 동기화

이미 Auth에 등록되어 있지만 `users` 테이블에 없는 사용자를 동기화하려면 다음 스크립트를 실행하세요:

```bash
node scripts/sync-auth-users.js
```

### 2.3. 환경 변수 설정

프로젝트의 환경 변수가 올바르게 설정되어 있는지 확인하세요:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: 익명 키
- `SUPABASE_SERVICE_KEY`: 서비스 키 (서버 측 API에 필요)

환경 변수 연결 테스트:

```bash
node scripts/test-supabase-connection.js
```

## 3. 회원가입 프로세스

회원가입 프로세스는 다음과 같이 작동합니다:

1. 사용자가 회원가입 양식을 작성하고 제출합니다.
2. Supabase Auth API를 통해 사용자가 등록됩니다.
3. 데이터베이스 트리거에 의해 자동으로 `users` 테이블에 사용자가 추가됩니다.
4. 트리거가 실패한 경우를 대비해 수동으로 사용자 정보를 API를 통해 `users` 테이블에 추가합니다.
5. 사용자는 자동으로 로그인되고 홈페이지로 리디렉션됩니다.

## 4. 로그인 프로세스

로그인 프로세스는 다음과 같이 작동합니다:

1. 사용자가 이메일과 비밀번호를 입력하고 제출합니다.
2. Supabase Auth API를 통해 사용자가 인증됩니다.
3. 인증이 성공하면 사용자는 홈페이지로 리디렉션됩니다.

## 5. 문제 해결

- 로그인이나 회원가입이 작동하지 않는 경우 브라우저 콘솔에서 오류 메시지를 확인하세요.
- 환경 변수가 올바르게 설정되어 있는지 확인하세요.
- `users` 테이블과 Auth 사용자 목록이 동기화되어 있는지 확인하세요.
