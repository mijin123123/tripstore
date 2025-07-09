import { NextResponse } from 'next/server';
import { checkConnection, getDatabaseStatus } from '@/lib/neon';

export async function GET() {
  try {
    // DB 연결 확인 및 상태 가져오기
    const status = await getDatabaseStatus();
    
    // SUSPENDED 상태 감지 및 관련 정보 추가
    const response = {
      ...status,
      timestamp: new Date().toISOString(),
      hint: status.suspendedDetected 
        ? "Neon DB가 SUSPENDED 상태입니다. 관리자 콘솔에서 브랜치를 활성화하세요." 
        : undefined
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('DB 상태 확인 중 오류 발생:', error);
    return NextResponse.json(
      { 
        error: 'DB 상태 확인 실패', 
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
