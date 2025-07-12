# MongoDB Atlas 설정 가이드

## 1. MongoDB Atlas 계정 생성

1. [MongoDB Atlas](https://www.mongodb.com/atlas) 접속
2. "Try Free" 버튼 클릭
3. Google 계정 또는 이메일로 가입

## 2. 새 프로젝트 및 클러스터 생성

### 프로젝트 생성
1. 로그인 후 "New Project" 클릭
2. 프로젝트 이름: `TripStore`
3. "Create Project" 클릭

### 클러스터 생성
1. "Create a deployment" 클릭
2. **M0 Sandbox (FREE)** 선택 (512MB 저장공간, 무료)
3. Cloud Provider: **AWS** 선택
4. Region: **ap-northeast-2 (Seoul)** 또는 **ap-southeast-1 (Singapore)** 선택
5. Cluster Name: `tripstore-cluster`
6. "Create Deployment" 클릭

## 3. 데이터베이스 사용자 생성

1. "Database Access" 메뉴로 이동
2. "Add New Database User" 클릭
3. Authentication Method: **Password** 선택
4. Username: `tripstore_user`
5. Password: 강력한 비밀번호 생성 (예: `TripStore2024!@#`)
6. Database User Privileges: **Built-in Role** → **Read and write to any database** 선택
7. "Add User" 클릭

## 4. 네트워크 접근 설정

1. "Network Access" 메뉴로 이동
2. "Add IP Address" 클릭
3. 개발용: **Allow access from anywhere** (0.0.0.0/0) 선택
4. 운영용: 실제 서버 IP만 허용
5. "Confirm" 클릭

## 5. 연결 문자열 얻기

1. "Database" 메뉴로 돌아가기
2. 클러스터에서 "Connect" 버튼 클릭
3. "Drivers" 선택
4. Driver: **Node.js**, Version: **6.0 or later** 선택
5. 연결 문자열 복사:

```
mongodb+srv://tripstore_user:<password>@tripstore-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## 6. 환경변수 설정

`.env.local` 파일에서 MONGODB_URI 설정:

```bash
MONGODB_URI=mongodb+srv://tripstore_user:실제비밀번호@tripstore-cluster.xxxxx.mongodb.net/tripstore?retryWrites=true&w=majority
```

**주의사항:**
- `<password>`를 실제 비밀번호로 교체
- `xxxxx`를 실제 클러스터 ID로 교체
- URL 끝에 `/tripstore` 데이터베이스 이름 추가

## 7. 데이터베이스 초기화

프로젝트 루트에서 다음 명령어로 데이터 마이그레이션:

```bash
node migrate-to-mongodb.js
```

## 8. Netlify 환경변수 설정

Netlify 대시보드에서:
1. Site settings → Environment variables
2. `MONGODB_URI` 키에 MongoDB 연결 문자열 값 추가

## 9. 보안 권장사항

### 운영 환경
- IP 화이트리스트를 서버 IP로 제한
- 강력한 비밀번호 사용
- 읽기 전용 사용자 별도 생성 고려

### 백업 설정
- MongoDB Atlas는 자동 백업 제공 (무료 플랜도 포함)
- Point-in-time recovery 설정 (유료 플랜)

## 10. 모니터링

MongoDB Atlas 대시보드에서 확인 가능:
- 연결 수
- 쿼리 성능
- 데이터 사용량
- 알림 설정

## 트러블슈팅

### 연결 오류
1. IP 주소가 화이트리스트에 있는지 확인
2. 사용자명/비밀번호 정확성 확인
3. 네트워크 연결 상태 확인

### 성능 이슈
1. 인덱스 최적화
2. 쿼리 최적화
3. 연결 풀 설정 조정

---

**참고 링크:**
- [MongoDB Atlas 공식 문서](https://docs.atlas.mongodb.com/)
- [Node.js MongoDB Driver 문서](https://docs.mongodb.com/drivers/node/)
- [Mongoose 공식 문서](https://mongoosejs.com/docs/)
