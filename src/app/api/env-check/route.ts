import { NextResponse } from 'next/server';

// 단순 환경 확인용 엔드포인트
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  // 중요 환경변수만 리스팅 (실제 값은 보여주지 않음)
  const envKeys = Object.keys(process.env);
  
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    NETLIFY: process.env.NETLIFY === 'true' ? 'true' : 'false',
    VERCEL: process.env.VERCEL === '1' ? 'true' : 'false',
    MONGO_KEYS: envKeys.filter(key => key.includes('MONGO')).length,
    JWT_KEYS: envKeys.filter(key => key.includes('JWT')).length,
    SERVER_RUNTIME: 'nodejs',
    TIMESTAMP: new Date().toISOString(),
    QUERY_TIME_MS: Date.now()
  };

  return NextResponse.json(envInfo, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}
