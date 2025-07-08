// 패키지 데이터를 DB에서 직접 가져와 저장하는 스크립트
import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import fs from 'fs';

async function extractPackagesFromDB() {
  console.log('=========================================');
  console.log('DB에서 패키지 데이터 추출하기');
  console.log('=========================================');
  
  try {
    const DATABASE_URL = process.env.NEON_DATABASE_URL;
    
    if (!DATABASE_URL) {
      throw new Error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
    }
    
    console.log('DB URL 확인됨. 연결 중...');
    
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    // 연결 테스트
    console.log('연결 테스트 중...');
    const client = await pool.connect();
    console.log('✅ 연결 성공!');
    
    // 패키지 데이터 가져오기
    console.log('\n패키지 데이터 가져오는 중...');
    const result = await client.query('SELECT * FROM packages');
    
    console.log(`패키지 수: ${result.rows.length}`);
    
    if (result.rows.length > 0) {
      // 첫 번째 패키지 구조 확인
      console.log('\n첫 번째 패키지 구조:');
      Object.keys(result.rows[0]).forEach(key => {
        console.log(`- ${key}: ${typeof result.rows[0][key]} (${result.rows[0][key] === null ? 'null' : result.rows[0][key]})`);
      });
      
      // 데이터를 파일로 저장
      const outputPath = './extracted-packages.json';
      fs.writeFileSync(
        outputPath, 
        JSON.stringify(result.rows, null, 2)
      );
      
      console.log(`\n✅ ${result.rows.length}개의 패키지 데이터를 ${outputPath}에 저장했습니다.`);
      
      // API 형식으로 변환된 데이터 저장
      const apiFormattedData = result.rows.map(pkg => ({
        ...pkg,
        // 필요한 변환 작업
        price: typeof pkg.price === 'string' ? pkg.price : String(pkg.price),
        discountprice: pkg.discountprice ? 
          (typeof pkg.discountprice === 'string' ? pkg.discountprice : String(pkg.discountprice)) : 
          null,
        rating: pkg.rating ? 
          (typeof pkg.rating === 'string' ? pkg.rating : String(pkg.rating)) : 
          null,
        // 날짜 처리
        created_at: pkg.created_at instanceof Date ? pkg.created_at.toISOString() : pkg.created_at,
        updated_at: pkg.updated_at instanceof Date ? pkg.updated_at.toISOString() : pkg.updated_at
      }));
      
      fs.writeFileSync(
        './api-packages.json', 
        JSON.stringify(apiFormattedData, null, 2)
      );
      console.log(`API 형식으로 변환된 데이터를 api-packages.json에 저장했습니다.`);
    } else {
      console.log('⚠️ DB에 패키지 데이터가 존재하지 않습니다.');
    }
    
    client.release();
    await pool.end();
    console.log('\nDB 연결 종료');
    
  } catch (error) {
    console.error('오류 발생:', error);
    console.error('스택 트레이스:', error.stack);
  }
}

extractPackagesFromDB().catch(console.error);
