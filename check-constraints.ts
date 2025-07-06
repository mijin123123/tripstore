import 'dotenv/config';
import { db } from './src/lib/neon';

async function checkConstraints() {
  try {
    // 특정 제약 조건 확인
    const result = await db.execute(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'reservations' 
      AND constraint_name = 'reservations_user_id_users_id_fk';
    `);
    
    console.log('reservations_user_id_users_id_fk 제약 조건 존재:', result.rows.length > 0);
    console.log('결과:', result.rows);
    
    // 사용자 테이블 존재 여부 확인
    const userTableResult = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users';
    `);
    
    console.log('\nusers 테이블 존재:', userTableResult.rows.length > 0);
    console.log('결과:', userTableResult.rows);
    
  } catch (error) {
    console.error('제약 조건 확인 중 오류:', error);
  }
}

checkConstraints();
