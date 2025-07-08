// 페이지에서 직접 패키지 가져오기 (API 사용 안함)
import { config } from 'dotenv';
config();

import pg from 'pg';

interface PackageResult {
  success: boolean;
  packages: any[];
  count?: number;
  error?: string;
}

// 관리자 UI에서 직접 사용할 수 있는 DB 함수
export async function fetchPackagesDirectly(): Promise<PackageResult> {
  const DATABASE_URL = process.env.NEON_DATABASE_URL || 
                      'postgresql://neondb_owner:npg_lu3rwg6HpLGn@ep-noisy-meadow-aex8wbzi-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';
                      
  console.log('직접 DB 연결을 통해 패키지 데이터 가져오는 중...');
  
  const { Pool } = pg;
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    const client = await pool.connect();
    console.log('DB 연결 성공!');
    
    const result = await client.query('SELECT * FROM packages');
    console.log(`${result.rows.length}개의 패키지를 찾았습니다.`);
    
    client.release();
    await pool.end();
    
    return {
      success: true,
      packages: result.rows,
      count: result.rows.length
    };
  } catch (error: any) {
    console.error('DB 연결 오류:', error);
    return {
      success: false,
      error: error?.message || '알 수 없는 오류',
      packages: []
    };
  }
}
