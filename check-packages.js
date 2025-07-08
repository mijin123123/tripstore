// 패키지 데이터베이스 상태 확인 스크립트
import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function checkPackagesInDB() {
  console.log('=========================================');
  console.log('패키지 데이터베이스 상태 확인 스크립트');
  console.log('=========================================');
  
  try {
    // ORM 부분은 건너뛰고 바로 직접 쿼리로 확인합니다
    
    // 2. 직접 쿼리로 확인
    console.log('\n2. 직접 SQL 쿼리로 패키지 조회 중...');
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // 패키지 테이블 존재 여부 확인
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'packages'
      );
    `);
    
    const packagesTableExists = tableCheck.rows[0].exists;
    console.log(`packages 테이블 존재 여부: ${packagesTableExists ? '존재함' : '존재하지 않음'}`);
    
    if (packagesTableExists) {
      // 패키지 수 확인
      const countResult = await pool.query('SELECT COUNT(*) FROM packages');
      console.log(`직접 쿼리 결과: ${countResult.rows[0].count}개의 패키지 발견`);
      
      // 패키지 데이터 샘플 확인
      const samplesResult = await pool.query('SELECT * FROM packages LIMIT 3');
      console.log('\n패키지 샘플 (최대 3개):');
      samplesResult.rows.forEach((pkg, index) => {
        console.log(`\n[${index + 1}번 패키지]`);
        console.log(`- ID: ${pkg.id}`);
        console.log(`- 제목: ${pkg.title}`);
        console.log(`- 가격: ${pkg.price}`);
        console.log(`- 목적지: ${pkg.destination}`);
        console.log(`- 생성일: ${pkg.created_at}`);
      });
      
      // 테이블 구조 확인
      const structureResult = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'packages';
      `);
      
      console.log('\n패키지 테이블 구조:');
      structureResult.rows.forEach(col => {
        console.log(`- ${col.column_name}: ${col.data_type}`);
      });
    }
    
    await pool.end();
    console.log('\n패키지 데이터베이스 확인 완료');
    
  } catch (error) {
    console.error('오류 발생:', error);
  }
}

checkPackagesInDB().catch(console.error);
