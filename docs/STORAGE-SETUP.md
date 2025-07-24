# Storage 설정 가이드

## Supabase Storage 버킷 설정

관리자 페이지에서 파일 업로드 기능을 사용하기 위해 Supabase Storage를 설정해야 합니다.

### 방법 1: 단계별 설정 (권장)

Supabase 대시보드에서 다음 SQL 파일들을 순서대로 실행하세요:

1. **1단계**: `database/step1-create-bucket.sql` - 버킷 생성
2. **2단계**: `database/step2-enable-rls.sql` - RLS 활성화
3. **3단계**: `database/step3-public-read.sql` - 공개 읽기 권한
4. **4단계**: `database/step4-auth-insert.sql` - 인증된 사용자 업로드 권한
5. **5단계**: `database/step5-auth-update-delete.sql` - 인증된 사용자 수정/삭제 권한
6. **6단계**: `database/step6-verify.sql` - 설정 확인

### 방법 2: 통합 설정

`database/setup-storage.sql` 파일을 Supabase 대시보드에서 실행하세요.

### Supabase 대시보드에서 실행하기

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 "SQL Editor" 클릭
4. 새 쿼리 생성
5. 위의 SQL 파일 내용을 복사해서 붙여넣기
6. "Run" 버튼 클릭

### 오류 해결

만약 정책 생성 시 오류가 발생하면:
1. 기존 정책을 먼저 삭제: `DROP POLICY IF EXISTS "정책이름" ON storage.objects;`
2. 새 정책 생성 재시도

### Storage 버킷 확인

SQL 실행 후 다음을 확인하세요:

1. 왼쪽 메뉴에서 "Storage" 클릭
2. "images" 버킷이 생성되었는지 확인
3. 버킷 설정에서 다음이 활성화되어 있는지 확인:
   - Public bucket: ✅ 활성화
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

### 3. 설정 완료 후 기능

설정이 완료되면 다음 기능들을 사용할 수 있습니다:

- **파일 업로드**: 관리자 페이지에서 이미지 파일을 직접 업로드
- **URL 입력**: 기존과 같이 이미지 URL을 직접 입력
- **이미지 미리보기**: 업로드한 이미지의 실시간 미리보기
- **파일 크기 제한**: 5MB 이하의 이미지만 업로드 가능
- **파일 타입 제한**: JPEG, PNG, WebP, GIF 파일만 업로드 가능

### 4. 사용 방법

1. 관리자 페이지 → 패키지 관리 → 패키지 생성/편집
2. 패키지 이미지 섹션에서:
   - **파일 업로드**: "파일 선택" 버튼으로 이미지 업로드
   - **URL 입력**: "이미지 URL 직접 입력" 필드에 URL 입력
3. 첫 번째 이미지가 메인 이미지로 사용됩니다
4. 최대 10개까지 이미지 추가 가능

### 5. 폴더 구조

업로드된 이미지는 다음 경로에 저장됩니다:
```
Supabase Storage > images 버킷 > packages/ 폴더
```

파일명 형식: `{timestamp}-{random}.{extension}`
예: `1703234567890-abc123.jpg`

### 6. 문제 해결

- **업로드 실패**: 파일 크기(5MB) 및 타입(이미지)을 확인하세요
- **이미지가 보이지 않음**: Storage 정책 설정을 다시 확인하세요
- **권한 오류**: 관리자 권한으로 로그인했는지 확인하세요
