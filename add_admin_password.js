// 관리자 테이블에 password 필드 추가 스크립트
import { config } from 'dotenv';
config();

import { Pool } from 'pg';

async function addPasswordColumn() {
  const pool = new Pool({
    connectionString: process.env.NEON_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('DB 연결 중...');
    
    // 테이블 구조 확인
    console.log('현재 admins 테이블 구조 확인 중...');
    const tableInfo = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'admins';
    `);
    
    console.log('현재 admins 테이블 컬럼:');
    tableInfo.rows.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });
    
    // password 컬럼 존재 여부 확인
    const hasPasswordColumn = tableInfo.rows.some(col => col.column_name === 'password');
    
    if (hasPasswordColumn) {
      console.log('password 컬럼이 이미 존재합니다.');
    } else {
      console.log('password 컬럼 추가 중...');
      await pool.query(`ALTER TABLE admins ADD COLUMN password TEXT;`);
      console.log('password 컬럼이 성공적으로 추가되었습니다.');
    }

  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await pool.end();
    console.log('DB 연결 종료');
  }
}

addPasswordColumn().catch(console.error);
