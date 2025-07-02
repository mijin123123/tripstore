# Supabase 비밀번호 재설정 설정 가이드

Supabase에서 비밀번호 재설정 기능이 올바르게 작동하도록 다음 단계를 수행해야 합니다.

## 1. Supabase 대시보드에서 리디렉션 URL 설정하기

1. Supabase 프로젝트 대시보드에 로그인합니다.
2. 왼쪽 메뉴에서 **Authentication** > **URL Configuration**으로 이동합니다.
3. **Redirect URLs** 섹션에서 다음 URL을 추가합니다:
   - 개발 환경: `http://localhost:3000/reset-password/update`
   - 프로덕션 환경: `https://your-production-domain.com/reset-password/update`

## 2. 이메일 템플릿 확인하기

1. Supabase 대시보드에서 **Authentication** > **Email Templates**으로 이동합니다.
2. **Password Reset** 템플릿을 클릭합니다.
3. 이메일 템플릿이 적절하게 설정되어 있는지 확인합니다.
4. 필요한 경우 템플릿을 수정합니다.

## 3. 사이트 URL 확인하기

1. Supabase 대시보드에서 **Project Settings** > **URL Configuration**으로 이동합니다.
2. **Site URL**이 올바르게 설정되어 있는지 확인합니다. 개발 환경에서는 `http://localhost:3000`으로 설정되어야 합니다.

## 4. 테스트하기

1. 개발 환경에서 비밀번호 재설정 기능을 테스트합니다.
2. 비밀번호 재설정 이메일을 받은 후 링크를 클릭하면 `/reset-password/update` 페이지로 리디렉션되어야 합니다.
3. 이 페이지에서 새 비밀번호를 설정할 수 있습니다.

## 문제 해결

- 리디렉션이 제대로 작동하지 않는 경우 Supabase 대시보드의 **Log Explorer**에서 관련 로그를 확인합니다.
- 브라우저 콘솔에서 오류 메시지를 확인합니다.
- 이메일에 포함된 링크의 URL 구조를 확인합니다.
