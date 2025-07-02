# Supabase 배포 환경 설정 가이드

Netlify에 배포된 환경에서 비밀번호 재설정 및 인증 기능이 올바르게 작동하도록 Supabase 프로젝트에서 다음 설정을 해야 합니다.

## 1. URL 설정

1. Supabase 대시보드에 로그인
2. 프로젝트 선택 후, 좌측 메뉴에서 **Authentication** → **URL Configuration** 선택

### 사이트 URL 설정

- **Site URL**: `https://mellifluous-druid-c34db0.netlify.app`

### 리디렉션 URL 추가

다음 URL들을 **Redirect URLs** 섹션에 추가:

- `https://mellifluous-druid-c34db0.netlify.app/`
- `https://mellifluous-druid-c34db0.netlify.app/reset-password/update`
- `https://mellifluous-druid-c34db0.netlify.app/reset-password`
- `http://localhost:3000/reset-password/update`
- `http://localhost:3000/reset-password`

## 2. 인증 설정 검토

1. **Authentication** → **Providers** 메뉴로 이동
2. **Email** 공급자가 활성화되어 있는지 확인
3. 다음 설정 확인:
   - **Confirm email**: 필요한 경우 활성화
   - **Secure email change**: 보안을 위해 활성화 권장

## 3. 이메일 템플릿 설정

1. **Authentication** → **Email Templates** 메뉴로 이동
2. **Password Reset** 템플릿 선택하고 내용이 적절한지 확인
3. 필요시 이메일 디자인 및 문구 수정

## 4. Netlify 배포 설정 확인

Netlify 배포 설정에서 다음 환경 변수가 올바르게 설정되어 있는지 확인:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키

## 5. 공통 오류 해결

### CORS 오류

CORS 오류가 발생할 경우:
1. Supabase 대시보드에서 **API** → **Settings** → **API Settings** 메뉴로 이동
2. **Additional CORS Origins** 섹션에 Netlify 도메인 추가: `https://mellifluous-druid-c34db0.netlify.app`

### 비밀번호 재설정 링크 동작 안 함

1. 브라우저 콘솔에서 오류 메시지 확인
2. Supabase 로그에서 관련 오류 확인 (SQL 에디터에서 `auth.audit_log` 테이블 조회)
3. 리디렉션 URL이 Supabase 프로젝트 설정에 등록되어 있는지 확인
