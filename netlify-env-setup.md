# Netlify 환경변수 설정 가이드 (MongoDB Atlas)

## 필수 환경변수 설정

Netlify 대시보드에서 다음 환경변수들을 설정해야 합니다:

### 1. MongoDB 연결 (필수)
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 2. JWT 시크릿 (필수)
```
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

### 3. 이미지 최적화 설정
```
NEXT_PUBLIC_ALLOWED_DOMAINS=images.unsplash.com,randomuser.me,upload.wikimedia.org,i.ibb.co
NEXT_IMAGE_DOMAINS=images.unsplash.com,randomuser.me,upload.wikimedia.org,i.ibb.co
NEXT_PUBLIC_ENABLE_IMAGE_OPTIMIZATION=true
```

### 4. Next.js 빌드 설정
```
NEXT_DISABLE_PRERENDER=true
NEXT_TELEMETRY_DISABLED=1
NODE_VERSION=20
```

## Netlify 환경변수 설정 방법

1. **Netlify 대시보드 접속**
   - https://app.netlify.com 로그인
   - 해당 프로젝트(사이트) 선택

2. **환경변수 설정**
   - **Site settings** → **Environment variables** 메뉴
   - **Add a variable** 버튼 클릭
   - 위의 필수 환경변수들을 하나씩 추가

3. **배포 재시작**
   - 환경변수 설정 완료 후
   - **Deploys** 탭 → **Trigger deploy** → **Deploy site**

## MongoDB Atlas 네트워크 설정

MongoDB Atlas에서 Netlify 접근을 허용해야 합니다:

1. **MongoDB Atlas 대시보드** 로그인
2. **Network Access** → **IP Access List**
3. **Add IP Address** 클릭
4. **Allow access from anywhere** (0.0.0.0/0) 선택
5. **Confirm** 클릭

## 배포 후 테스트 방법

1. **API 테스트**
   ```
   https://your-site.netlify.app/api/packages
   ```

2. **환경변수 확인**
   ```
   https://your-site.netlify.app/api/health
   ```

3. **패키지 페이지 확인**
   ```
   https://your-site.netlify.app/packages
   ```

## 문제 해결

### MONGODB_URI 오류
- 환경변수 이름 정확히 입력 (대소문자 구분)
- MongoDB 연결 문자열에 특수문자가 있는 경우 URL 인코딩
- Atlas 네트워크 접근 허용 설정 확인

### JWT_SECRET 오류  
- 최소 32자 이상의 복잡한 문자열 사용
- 영문/숫자/특수문자 조합 권장

### Edge Runtime 호환성 경고
- jsonwebtoken 라이브러리의 Node.js API 사용으로 인한 경고
- 기능상 문제없음 (경고만 발생)
