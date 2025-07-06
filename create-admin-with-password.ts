import { db } from './src/lib/neon';
import { admins } from './src/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function createAdminWithPassword() {
  try {
    console.log('=== 관리자 계정 생성 (비밀번호 포함) ===');
    
    // 비밀번호 해시화
    const password = 'aszx1212';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    console.log('비밀번호 해시화 완료');
    
    // 관리자 계정 생성
    const admin = await db
      .insert(admins)
      .values({
        email: 'sonchanmin89@gmail.com',
        password: hashedPassword,
      })
      .returning();
    
    console.log('관리자 계정이 성공적으로 생성되었습니다:', {
      email: admin[0].email,
      createdAt: admin[0].createdAt
    });
    
    // 비밀번호 확인 테스트
    const isPasswordCorrect = await bcrypt.compare(password, admin[0].password);
    console.log('비밀번호 확인 테스트:', isPasswordCorrect ? '성공' : '실패');
    
  } catch (error) {
    console.error('관리자 계정 생성 중 오류:', error);
    
    // 이미 존재하는 경우 비밀번호 업데이트
    if (error.message?.includes('unique constraint')) {
      console.log('이미 존재하는 관리자 계정입니다. 비밀번호를 업데이트합니다.');
      
      const password = 'aszx1212';
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const updatedAdmin = await db
        .update(admins)
        .set({ password: hashedPassword })
        .where(eq(admins.email, 'sonchanmin89@gmail.com'))
        .returning();
      
      console.log('비밀번호 업데이트 완료:', {
        email: updatedAdmin[0].email,
        updatedAt: new Date()
      });
    }
  }
}

createAdminWithPassword().then(() => {
  console.log('완료');
  process.exit(0);
});
