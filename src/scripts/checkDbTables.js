// 데이터베이스 테이블 직접 확인 스크립트
import { config } from 'dotenv';
config();

import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.NEON_DATABASE_URL || 
                    "postgresql://neondb_owner:npg_lu3rwg6HpLGn@ep-noisy-meadow-aex8wbzi-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function checkDbTables() {
  console.log('===== 데이터베이스 테이블 확인 스크립트 =====');
  console.log('1. 연결 시도 중...');
  console.log(`데이터베이스 URL: ${DATABASE_URL.substring(0, 15)}...`);
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // 1. 연결 테스트
    console.log('2. 연결 테스트...');
    const client = await pool.connect();
    console.log('   데이터베이스 연결 성공!');
    
    // 2. 테이블 목록 조회
    console.log('3. 테이블 목록 조회...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('   데이터베이스 테이블 목록:');
    tablesResult.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // 3. packages 테이블 확인
    console.log('\n4. packages 테이블 확인...');
    try {
      const packagesCountResult = await client.query('SELECT COUNT(*) FROM packages;');
      console.log(`   packages 테이블에는 ${packagesCountResult.rows[0].count}개의 행이 있습니다.`);
      
      if (parseInt(packagesCountResult.rows[0].count) > 0) {
        console.log('   첫 5개 패키지 조회 중...');
        const packagesResult = await client.query('SELECT id, title, destination, price FROM packages LIMIT 5;');
        console.log('   패키지 샘플:');
        packagesResult.rows.forEach(pkg => {
          console.log(`   - ID: ${pkg.id}, 제목: ${pkg.title}, 목적지: ${pkg.destination}, 가격: ${pkg.price}`);
        });
      }
    } catch (packagesError) {
      console.error(`   packages 테이블 조회 실패: ${packagesError.message}`);
    }
    
    // 4. 스키마 정보 확인
    console.log('\n5. packages 테이블 스키마 확인...');
    try {
      const schemaResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'packages' 
        ORDER BY ordinal_position;
      `);
      
      if (schemaResult.rows.length > 0) {
        console.log('   packages 테이블 컬럼:');
        schemaResult.rows.forEach(col => {
          console.log(`   - ${col.column_name} (${col.data_type}, ${col.is_nullable === 'YES' ? '널 허용' : '널 불허용'})`);
        });
      } else {
        console.log('   packages 테이블이 존재하지 않거나 컬럼 정보가 없습니다.');
      }
    } catch (schemaError) {
      console.error(`   스키마 정보 조회 실패: ${schemaError.message}`);
    }
    
    // 연결 종료
    client.release();
    console.log('\n테이블 확인 완료!');
    
  } catch (err) {
    console.error('데이터베이스 오류:', err);
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
checkDbTables().catch(err => {
  console.error('스크립트 실행 오류:', err);
  process.exit(1);
});
