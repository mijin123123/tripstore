# Netlify 환경 변수 설정 가이드

## 필수 환경 변수들

다음 환경 변수들을 Netlify 대시보드에서 설정해야 합니다:

### 1. Supabase 기본 설정
```
NEXT_PUBLIC_SUPABASE_URL=https://ewezrjlymdfinpwfruga.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZXpyamx5bWRmaW5wd2ZydWdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMzI5MTAsImV4cCI6MjA2NjkwODkxMH0.KWLNVNQUSzMa2pNzF-q8BWhZ6jIzavQT4_aWo6LFM90
```

### 2. 관리자 전용 Service Role Key (중요!)
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3ZXpyamx5bWRmaW5wd2ZydWdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTMzMjkxMCwiZXhwIjoyMDY2OTA4OTEwfQ.OLIGpqn4aZGJqOT7bYTODtmAqhKQwSNIJdJNaJpkkLU
```

### 3. 이미지 최적화 설정
```
NEXT_PUBLIC_ALLOWED_DOMAINS=images.unsplash.com,randomuser.me,upload.wikimedia.org
NEXT_IMAGE_DOMAINS=images.unsplash.com,randomuser.me,upload.wikimedia.org
NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION=true
```

### 4. 빌드 설정
```
NEXT_DISABLE_PRERENDER=true
```

## Netlify 환경 변수 설정 방법

1. Netlify 대시보드에 로그인
2. 프로젝트 선택
3. Site settings → Environment variables
4. 위 변수들을 하나씩 추가
5. 배포 재시작

## 주의사항
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 클라이언트에서 사용하지 마세요
- 이 키는 관리자 작업에만 서버 사이드에서 사용됩니다
- 환경 변수 설정 후 반드시 다시 배포해야 합니다
