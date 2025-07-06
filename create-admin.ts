import { db } from './src/lib/neon';
import { admins } from './src/lib/schema';
import { eq } from 'drizzle-orm';

async function createAdmin() {
  try {
    console.log('=== 관리자 계정 생성 ===');
    
    // 관리자 계정 생성
    const admin = await db
      .insert(admins)
      .values({
        email: 'sonchanmin89@gmail.com',
      })
      .returning();
    
    console.log('관리자 계정이 성공적으로 생성되었습니다:', admin[0]);
    
  } catch (error) {
    console.error('관리자 계정 생성 중 오류:', error);
    
    // 이미 존재하는 경우 확인
    if (error.message?.includes('unique constraint')) {
      console.log('이미 존재하는 관리자 계정입니다.');
      
      // 기존 관리자 계정 확인
      const existingAdmin = await db
        .select()
        .from(admins)
        .where(eq(admins.email, 'sonchanmin89@gmail.com'));
      
      console.log('기존 관리자 계정:', existingAdmin[0]);
    }
  }
}

createAdmin().then(() => {
  console.log('완료');
  process.exit(0);
});
