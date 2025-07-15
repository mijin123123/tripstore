import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

/**
 * 관리자 토큰 검증 API
 */
export async function POST(request: NextRequest) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '토큰이 필요합니다.' }, { status: 401 });
    }
    
    const token = authHeader.substring(7); // 'Bearer ' 제거
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    
    // 토큰 검증
    let user;
    try {
      user = verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }
    
    if (!user) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다.' }, { status: 401 });
    }
    
    // 관리자 권한 확인
    if ((user as any).role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: {
        id: (user as any).id,
        email: (user as any).email,
        name: (user as any).name,
        role: (user as any).role
      }
    });
    
  } catch (error) {
    console.error('토큰 검증 중 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
