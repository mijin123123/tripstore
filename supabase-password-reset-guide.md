# Supabase 비밀번호 재설정 링크 설정 가이드

비밀번호 재설정 링크가 제대로 작동하지 않는 문제를 해결하기 위한 최종 설정 가이드입니다.

## 1. Supabase 프로젝트 설정

Supabase 대시보드에서 다음 설정을 확인하고 변경해주세요:

### 1.1. URL 설정

1. **Project Settings** > **URL Configuration**으로 이동
2. **Site URL**이 현재 배포 도메인(예: `https://mellifluous-druid-c34db0.netlify.app`)으로 설정되어 있는지 확인
3. **Redirect URLs**에 다음 URL을 추가:
   - `https://mellifluous-druid-c34db0.netlify.app/reset-password/update`
   - `https://mellifluous-druid-c34db0.netlify.app/reset-password`
   - `https://mellifluous-druid-c34db0.netlify.app/*`

### 1.2. 이메일 템플릿 설정

1. **Authentication** > **Email Templates**으로 이동
2. **Password Reset** 템플릿 선택
3. 이메일 템플릿에서 URL이 올바른지 확인 (기본적으로 Supabase가 관리함)

## 2. Netlify 설정 확인

netlify.toml 파일에 다음 리디렉션 규칙이 있는지 확인:

```toml
# 비밀번호 재설정 특별 처리
[[redirects]]
  from = "/reset-password/*"
  to = "/reset-password/[...slug].html"
  status = 200

# 인증 관련 리디렉션 처리 - 해시 파라미터 (# 이후 부분)
[[redirects]]
  from = "/*type=recovery*"
  to = "/reset-password/update/"
  status = 301
  force = true

# 쿼리 파라미터가 있는 URL 처리
[[redirects]]
  from = "/?type=recovery*"
  to = "/reset-password/update/"
  status = 301
  force = true
```

## 3. 추가 디버깅 팁

1. **브라우저 콘솔 확인**: 비밀번호 재설정 이메일을 받고 링크를 클릭할 때 브라우저 콘솔을 열어서 로그를 확인하세요. 다음과 같은 정보를 볼 수 있어야 합니다:
   - 현재 URL
   - 토큰 정보
   - 리디렉션 상태

2. **인증 흐름 확인**: 비밀번호 재설정 링크를 클릭하면 다음 흐름으로 진행되어야 합니다:
   - 비밀번호 재설정 이메일 링크 클릭
   - (미들웨어에 의해) /reset-password/update 페이지로 리디렉션
   - URL 파라미터 처리 및 세션 설정
   - 새 비밀번호 입력 및 변경

3. **수동 URL 입력**: 문제가 지속된다면, 비밀번호 재설정 이메일에서 링크 주소를 복사하여 브라우저에 직접 붙여넣기 해보세요.

## 4. 최종 확인

비밀번호 재설정 과정에서 문제가 발생한다면 다음을 확인하세요:

1. 미들웨어가 URL 파라미터를 올바르게 처리하고 있는지
2. Supabase 클라이언트가 세션을 올바르게 설정하고 있는지
3. redirectTo URL이 정확하고 Supabase에 등록되어 있는지

이 모든 설정이 올바르게 되어 있다면, 비밀번호 재설정 링크가 정상적으로 작동해야 합니다.
