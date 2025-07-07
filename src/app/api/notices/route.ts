import { NextResponse } from 'next/server';

// 더미 공지사항 데이터 (DB 연결 실패 시 사용)
const fallbackNotices = [
  {
    id: "not-001",
    title: "여름 성수기 패키지 할인 이벤트",
    content: "7월 한 달간 모든 여름 패키지 10% 할인 이벤트를 진행합니다. 지금 바로 예약하세요!",
    isImportant: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "not-002",
    title: "시스템 점검 안내",
    content: "시스템 점검으로 인해 7월 15일 오전 2시부터 4시까지 서비스 이용이 제한될 수 있습니다.",
    isImportant: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "not-003",
    title: "개인정보처리방침 개정 안내",
    content: "개인정보처리방침이 2024년 6월 30일부터 변경됩니다. 자세한 내용은 본문을 참고하세요.",
    isImportant: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET() {
  try {
    console.log('공지사항 데이터 요청을 처리 중...');
    
    // 실제 데이터베이스 연결 코드 대신, 항상 더미 데이터 반환
    // 추후 DB 연결이 복구되면 실제 데이터로 변경 가능
    return NextResponse.json(fallbackNotices);
  } catch (error) {
    console.error('공지사항 데이터 가져오기 실패:', error);
    // 오류 발생 시에도 더미 데이터 반환
    console.log('더미 공지사항 데이터를 반환합니다.');
    return NextResponse.json(fallbackNotices);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 더미 응답을 반환 (실제로 저장되지는 않음)
    const newNotice = {
      id: `not-${Math.floor(Math.random() * 1000)}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(newNotice, { status: 201 });
  } catch (error) {
    console.error('공지사항 생성 실패:', error);
    return NextResponse.json(
      { 
        error: '공지사항을 생성할 수 없습니다.', 
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }, 
      { status: 500 }
    );
  }
}
