import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    
    // 데이터베이스 연결 테스트
    const { data, error } = await supabase.from('packages').select('count').limit(1);
    
    if (error) {
      console.error('Health check 오류:', error);
      return new NextResponse(
        JSON.stringify({ 
          status: 'error', 
          message: error.message,
          timestamp: new Date().toISOString()
        }),
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check 예외:', error);
    return new NextResponse(
      JSON.stringify({ 
        status: 'error', 
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      }),
      { status: 500 }
    );
  }
}
