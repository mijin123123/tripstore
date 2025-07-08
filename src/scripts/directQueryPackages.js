// 직접 SQL 쿼리로 패키지 테이블 확인
import { config } from 'dotenv';
config();

import pg from 'pg';
const { Pool } = pg;

const DATABASE_URL = process.env.NEON_DATABASE_URL || 
                    "postgresql://neondb_owner:npg_lu3rwg6HpLGn@ep-noisy-meadow-aex8wbzi-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function queryPackagesDirectly() {
  console.log('===== 직접 SQL 쿼리로 패키지 테이블 확인 =====');
  console.log(`데이터베이스 URL: ${DATABASE_URL.substring(0, 20)}...`);
  
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('데이터베이스에 연결 중...');
    const client = await pool.connect();
    console.log('연결 성공!');
    
    try {
      // 1. 테이블 정보 확인
      console.log('\n1. 테이블 목록 확인:');
      const tablesResult = await client.query(`
        SELECT table_name, table_schema
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      
      tablesResult.rows.forEach(row => {
        console.log(`- ${row.table_name} (스키마: ${row.table_schema})`);
      });
      
      // 2. 패키지 테이블이 있는지 확인
      console.log('\n2. 패키지 테이블 존재 여부 확인:');
      const tableExists = tablesResult.rows.some(row => row.table_name === 'packages');
      console.log(`'packages' 테이블 존재: ${tableExists ? '예' : '아니오'}`);
      
      if (tableExists) {
        // 3. 패키지 개수 확인
        console.log('\n3. 패키지 개수 확인:');
        const countResult = await client.query('SELECT COUNT(*) FROM packages;');
        console.log(`패키지 개수: ${countResult.rows[0].count}`);
        
        // 4. 테이블 구조 확인
        console.log('\n4. 테이블 구조 확인:');
        const columnsResult = await client.query(`
          SELECT column_name, data_type, column_default
          FROM information_schema.columns
          WHERE table_name = 'packages'
          ORDER BY ordinal_position;
        `);
        
        columnsResult.rows.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type}) ${col.column_default ? '기본값: ' + col.column_default : ''}`);
        });
        
        // 5. 첫 번째 패키지 데이터 확인
        if (parseInt(countResult.rows[0].count) > 0) {
          console.log('\n5. 첫 번째 패키지 데이터:');
          const packageData = await client.query('SELECT * FROM packages LIMIT 1;');
          console.log(JSON.stringify(packageData.rows[0], null, 2));
          
          // 6. 모든 패키지 ID와 제목 출력
          console.log('\n6. 모든 패키지 ID와 제목:');
          const allPackages = await client.query('SELECT id, title FROM packages;');
          allPackages.rows.forEach(pkg => {
            console.log(`- ID: ${pkg.id}, 제목: ${pkg.title}`);
          });
        }
        
        // 7. 대소문자 구분 확인
        console.log('\n7. 대소문자 구분 테스트:');
        
        // 첫 번째 쿼리: 원래 컬럼명
        console.log('원래 컬럼명으로 조회:');
        try {
          const result1 = await client.query('SELECT id, title, created_at FROM packages LIMIT 1;');
          console.log(`성공: ${result1.rows.length}개 행 반환`);
          if (result1.rows.length > 0) {
            console.log(`created_at 값:`, result1.rows[0].created_at);
          }
        } catch (err) {
          console.error(`실패: ${err.message}`);
        }
        
        // 두 번째 쿼리: 대문자 컬럼명
        console.log('\n대문자 컬럼명으로 조회:');
        try {
          const result2 = await client.query('SELECT "ID", "TITLE", "CREATED_AT" FROM packages LIMIT 1;');
          console.log(`성공: ${result2.rows.length}개 행 반환`);
        } catch (err) {
          console.error(`실패: ${err.message}`);
        }
        
        // 세 번째 쿼리: camelCase 컬럼명
        console.log('\ncamelCase 컬럼명으로 조회:');
        try {
          const result3 = await client.query('SELECT "id", "title", "createdAt" FROM packages LIMIT 1;');
          console.log(`성공: ${result3.rows.length}개 행 반환`);
        } catch (err) {
          console.error(`실패: ${err.message}`);
        }
      }
    } catch (queryError) {
      console.error('쿼리 실행 오류:', queryError);
    } finally {
      client.release();
    }
    
  } catch (err) {
    console.error('데이터베이스 연결 오류:', err);
  } finally {
    await pool.end();
  }
}

// 스크립트 실행
queryPackagesDirectly().catch(err => {
  console.error('스크립트 실행 오류:', err);
});
