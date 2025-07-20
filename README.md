# TripStore - 해외여행 전문 여행사 웹사이트

![TripStore Logo](https://via.placeholder.com/300x80/3b82f6/ffffff?text=TripStore)

## 🌍 프로젝트 소개

TripStore는 해외여행을 꿈꾸는 여행자들을 위한 전문 여행사 웹사이트입니다. Node.js와 TypeScript를 기반으로 한 현대적인 웹 애플리케이션으로, 다양한 여행 패키지와 맞춤형 여행 서비스를 제공합니다.

### ✨ 주요 기능

- 🎯 **여행 패키지 관리**: 다양한 해외 여행 패키지 조회 및 예약
- 🔍 **스마트 검색**: 목적지, 날짜, 예산별 맞춤 검색
- 👤 **회원 관리**: 회원가입, 로그인, 프로필 관리
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용자 경험
- 🛡️ **보안**: JWT 인증, 데이터 검증, 보안 헤더
- 📊 **실시간 데이터**: Supabase를 통한 실시간 데이터베이스 연동

## 🚀 기술 스택

### Backend
- **Node.js**: 서버 런타임 환경
- **TypeScript**: 정적 타입 검사
- **Express.js**: 웹 프레임워크
- **Supabase**: 실시간 데이터베이스 및 인증

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 현대적인 스타일링 (Grid, Flexbox, 애니메이션)
- **JavaScript ES6+**: 인터랙티브 기능
- **Font Awesome**: 아이콘 라이브러리

### DevOps & Tools
- **Netlify**: 배포 및 호스팅
- **Git**: 버전 관리
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

## 📦 설치 및 실행

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 8.0.0 이상

### 1. 저장소 클론
```bash
git clone https://github.com/trip1235/tripstore.git
cd tripstore
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp .env.example .env
```

`.env` 파일을 열어 다음 값들을 설정하세요:

```bash
# 환경 설정
NODE_ENV=development
PORT=3000

# Supabase 설정
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# 기타 설정
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
LOG_LEVEL=info
API_RATE_LIMIT=100
```

### 4. 개발 서버 실행
```bash
# 개발 모드 (TypeScript watch + nodemon)
npm run dev

# 또는 빌드 후 실행
npm run build
npm start
```

서버가 성공적으로 시작되면 http://localhost:3000 에서 확인할 수 있습니다.

## 📁 프로젝트 구조

```
tripstore/
├── src/                    # TypeScript 소스 코드
│   ├── app.ts             # Express 애플리케이션 설정
│   ├── server.ts          # 서버 진입점
│   ├── middleware/        # 미들웨어
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/            # API 라우트
│   │   └── api.ts
│   ├── services/          # 비즈니스 로직
│   │   └── supabaseService.ts
│   ├── types/             # TypeScript 타입 정의
│   │   └── index.ts
│   └── utils/             # 유틸리티
│       ├── config.ts
│       ├── logger.ts
│       ├── response.ts
│       └── validation.ts
├── public/                # 정적 파일
│   ├── index.html        # 메인 HTML
│   ├── css/              # 스타일시트
│   │   └── style.css
│   └── js/               # JavaScript
│       └── app.js
├── dist/                 # 컴파일된 JavaScript (빌드 후 생성)
├── package.json          # 프로젝트 설정
├── tsconfig.json         # TypeScript 설정
├── netlify.toml          # Netlify 배포 설정
└── README.md             # 프로젝트 문서
```

## 🔧 개발 스크립트

```bash
# 개발 환경 실행 (TypeScript watch + nodemon)
npm run dev

# TypeScript 빌드
npm run build

# TypeScript watch 모드
npm run build:watch

# 프로덕션 서버 실행
npm start

# 빌드 파일 정리
npm run clean

# 테스트 실행
npm test
npm run test:watch
npm run test:coverage

# 코드 품질 관리
npm run lint
npm run lint:fix
npm run format
```

## 🌐 API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### 여행 패키지
- `GET /api/packages` - 패키지 목록 조회
- `GET /api/packages/:id` - 패키지 상세 조회
- `POST /api/packages` - 패키지 생성 (관리자)
- `PUT /api/packages/:id` - 패키지 수정 (관리자)
- `DELETE /api/packages/:id` - 패키지 삭제 (관리자)

### 예약
- `POST /api/bookings` - 예약 생성
- `GET /api/bookings/user/:userId` - 사용자 예약 목록
- `PUT /api/bookings/:id` - 예약 수정

### 기타
- `GET /api/destinations/popular` - 인기 목적지
- `GET /api/search/autocomplete` - 검색 자동완성
- `GET /api/health` - 서버 상태 확인

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #3b82f6 (블루)
- **Secondary**: #64748b (그레이)
- **Accent**: #f59e0b (오렌지)
- **Success**: #10b981 (그린)
- **Warning**: #f59e0b (옐로우)
- **Error**: #ef4444 (레드)

### 타이포그래피
- **Font Family**: Noto Sans KR
- **Base Size**: 16px
- **Scale**: 0.75rem ~ 3.5rem

### 브레이크포인트
- **Mobile**: < 768px
- **Tablet**: 768px ~ 1024px
- **Desktop**: > 1024px

## 🚀 배포

### Netlify 배포
1. Netlify 계정에 로그인
2. GitHub 저장소 연결
3. 빌드 설정: `npm run build`
4. 배포 디렉토리: `public`
5. 환경 변수 설정

### 수동 배포
```bash
# 프로덕션 빌드
npm run build

# 정적 파일과 빌드된 파일을 웹서버에 업로드
```

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 테스트 watch 모드
npm run test:watch

# 커버리지 리포트 생성
npm run test:coverage
```

## 📝 개발 가이드라인

### 코드 스타일
- TypeScript strict 모드 사용
- ESLint + Prettier 설정 준수
- 함수형 프로그래밍 선호
- 명확하고 의미있는 변수명 사용

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가/수정
chore: 빌드 설정 등 기타 변경
```

### 브랜치 전략
- `main`: 프로덕션 배포 브랜치
- `develop`: 개발 통합 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

## 🐛 문제 해결

### 자주 발생하는 문제들

1. **포트 이미 사용 중 오류**
   ```bash
   # 다른 포트 사용
   PORT=3001 npm run dev
   ```

2. **TypeScript 컴파일 오류**
   ```bash
   # 의존성 재설치
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **환경 변수 로드 안됨**
   - `.env` 파일이 루트 디렉토리에 있는지 확인
   - 변수명이 정확한지 확인

## 🤝 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'feat: Add amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👥 팀

- **개발팀**: TripStore Development Team
- **이메일**: sonchanmin89@gmail.com
- **웹사이트**: [https://tripstore.netlify.app](https://tripstore.netlify.app)

## 📞 지원

문제가 있거나 질문이 있으시면 다음 방법으로 연락해 주세요:

- 📧 이메일: support@tripstore.com
- 🐛 Issues: [GitHub Issues](https://github.com/trip1235/tripstore/issues)
- 💬 토론: [GitHub Discussions](https://github.com/trip1235/tripstore/discussions)

---

⭐ 이 프로젝트가 도움이 되었다면 별표를 눌러주세요!
