import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// 데이터베이스 연결 유지를 위한 헬스체크 API
export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    
    if (!databaseUrl) {
      // 데이터베이스 연결이 없으면 Mock 모드로 작동
      return NextResponse.json({
        status: 'mock',
        timestamp: new Date().toISOString(),
        database_version: 'Mock Database v1.0',
        message: '데이터베이스 연결이 설정되지 않아 Mock 모드로 작동 중입니다.'
      });
    }

    const pool = new Pool({ connectionString: databaseUrl });
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    await pool.end();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: result.rows[0].current_time,
      database_version: result.rows[0].db_version,
      message: '데이터베이스 연결이 정상입니다.'
    });
  } catch (error) {
    console.error('데이터베이스 헬스체크 실패:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: '데이터베이스 연결에 실패했습니다.',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
