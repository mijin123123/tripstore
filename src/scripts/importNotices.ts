// .env 파일을 로드합니다.
import { config } from 'dotenv';
config();

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { notices } from '../lib/schema';
import { v4 as uuidv4 } from 'uuid';

// 데이터베이스 연결 설정
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.NETLIFY_DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('데이터베이스 URL이 설정되지 않았습니다.');
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

// 샘플 공지사항 데이터
const sampleNotices = [
  {
    title: "여름 성수기 특별 할인 이벤트",
    content: `
# 여름 성수기 특별 할인 이벤트 안내

안녕하세요, 트립스토어 고객 여러분!

무더운 여름을 맞이하여, 트립스토어에서 여름 성수기 특별 할인 이벤트를 준비했습니다.

## 이벤트 내용
- **기간**: 2025년 7월 15일 ~ 8월 31일
- **대상 패키지**: 모든 여름 시즌 패키지
- **할인율**: 최대 15% 할인

## 혜택 안내
1. 조기 예약 시 추가 5% 할인 (출발 30일 전 예약 완료 시)
2. 가족 단위 예약 시 어린이 1인 무료 (성인 2인 이상 예약 시)
3. 리뷰 작성 시 다음 예약에 사용 가능한 포인트 적립

지금 바로 트립스토어에서 즐거운 여름 휴가를 계획해 보세요!

감사합니다.
    `,
    isImportant: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "시스템 점검 안내 (7월 15일 새벽 2시 ~ 4시)",
    content: `
# 시스템 점검 안내

안녕하세요, 트립스토어입니다.

서비스 품질 향상을 위한 시스템 점검이 진행될 예정입니다.

## 점검 일정
- **일시**: 2025년 7월 15일 (화) 오전 2:00 ~ 4:00 (약 2시간)
- **영향**: 해당 시간 동안 웹사이트 및 모바일 앱 서비스 이용 불가

## 참고사항
- 점검 시간은 작업 상황에 따라 단축되거나 연장될 수 있습니다.
- 점검 완료 후 정상적인 서비스 이용이 가능합니다.

서비스 이용에 불편을 드려 죄송합니다.
더 나은 서비스 제공을 위해 노력하겠습니다.

감사합니다.
    `,
    isImportant: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "개인정보처리방침 개정 안내",
    content: `
# 개인정보처리방침 개정 안내

안녕하세요, 트립스토어입니다.

당사의 개인정보처리방침이 2025년 6월 30일부터 아래와 같이 변경됨을 안내드립니다.

## 주요 변경사항
1. 개인정보의 수집·이용 목적 명확화
2. 개인정보 보유 및 이용기간 세분화
3. 개인정보 처리 위탁 업체 현행화

## 시행일
- 2025년 6월 30일부터 시행

개정된 개인정보처리방침은 홈페이지 하단의 '개인정보처리방침' 메뉴에서 확인하실 수 있습니다.

개정된 개인정보처리방침에 동의하지 않으시는 경우, 회원 탈퇴가 가능합니다.
기타 문의사항이 있으시면 고객센터로 연락주시기 바랍니다.

감사합니다.
    `,
    isImportant: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "신규 회원 가입 혜택 안내",
    content: `
# 신규 회원 가입 혜택 안내

트립스토어에 처음 가입하시는 모든 분들께 특별한 혜택을 드립니다!

## 신규 회원 혜택
- **1만원 할인 쿠폰** 즉시 지급 (10만원 이상 예약 시)
- **회원 전용 특가 상품** 이용 가능
- **여행 준비 체크리스트** PDF 제공

## 혜택 이용 방법
1. 트립스토어 홈페이지 또는 앱에서 회원가입
2. 이메일 인증 완료
3. 마이페이지에서 쿠폰 및 혜택 확인

많은 이용 바랍니다.
감사합니다.
    `,
    isImportant: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "추석 연휴 여행 패키지 예약 안내",
    content: `
# 추석 연휴 여행 패키지 예약 안내

안녕하세요, 트립스토어입니다.

다가오는 추석 연휴를 맞이하여 특별 패키지를 준비했습니다.

## 추석 연휴 특별 패키지
- **국내 여행**: 제주, 부산, 강원도 특별 패키지
- **해외 여행**: 일본, 동남아, 괌/사이판 등 인기 목적지
- **예약 마감일**: 출발일 2주 전까지 (좌석 소진 시 조기 마감)

## 추석 연휴 예약 팁
- 항공권과 호텔이 포함된 패키지 상품 이용 시 최대 20% 할인
- 연휴 기간 항공권은 조기 매진되는 경우가 많으니 서둘러 예약하세요
- 가족 단위 예약 시 추가 할인 가능

자세한 정보는 홈페이지 특별 기획전을 참고해 주세요.

즐거운 추석 연휴 계획 되세요!
    `,
    isImportant: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function importNotices() {
  try {
    console.log('공지사항 데이터 가져오기 시작...');
    
    // 기존 공지사항을 조회
    const existingNotices = await db.select().from(notices);
    console.log(`현재 ${existingNotices.length}개의 공지사항이 DB에 등록되어 있습니다.`);
    
    if (existingNotices.length > 0) {
      console.log('이미 공지사항 데이터가 등록되어 있습니다. 중복 등록을 방지하기 위해 가져오기를 중단합니다.');
      return;
    }
    
    // ID 추가
    const noticesWithIds = sampleNotices.map(notice => ({
      id: uuidv4(),
      ...notice
    }));
    
    console.log(`${noticesWithIds.length}개의 공지사항 데이터를 준비했습니다.`);
    
    // DB에 삽입
    const insertedNotices = await db.insert(notices).values(noticesWithIds).returning();
    console.log(`${insertedNotices.length}개의 공지사항을 성공적으로 DB에 등록했습니다.`);
    
  } catch (error) {
    console.error('공지사항 가져오기 중 오류 발생:', error);
  }
}

// 스크립트가 직접 실행된 경우에만 importNotices 함수를 실행
if (require.main === module) {
  importNotices()
    .then(() => console.log('공지사항 가져오기 작업 완료'))
    .catch(error => console.error('공지사항 가져오기 작업 실패:', error))
    .finally(() => process.exit());
}

export { importNotices };
