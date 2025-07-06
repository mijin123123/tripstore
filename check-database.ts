import 'dotenv/config';
import { db } from './src/lib/neon';

async function checkDatabase() {
  try {
    // 테이블 정보 확인
    const result = await db.execute(`
      SELECT 
        table_name,
        constraint_name,
        constraint_type
      FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
      AND table_name IN ('reservations', 'reviews', 'packages', 'admins', 'notices')
      ORDER BY table_name, constraint_name;
    `);
    
    console.log('현재 데이터베이스 제약 조건:');
    console.log(result.rows);
    
    // 외래 키 제약 조건 상세 확인
    const fkResult = await db.execute(`
      SELECT 
        tc.table_name,
        tc.constraint_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND tc.table_name IN ('reservations', 'reviews');
    `);
    
    console.log('\n외래 키 제약 조건:');
    console.log(fkResult.rows);
    
  } catch (error) {
    console.error('데이터베이스 확인 중 오류:', error);
  }
}

checkDatabase();
