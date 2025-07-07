import { db } from '../src/lib/neon.ts';
import { admins } from '../src/lib/schema.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const updateAdminPassword = async () => {
  try {
    const email = 'sonchanmin89@gmail.com';
    const plainPassword = 'admin123'; // 실제 비밀번호
    
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    // 데이터베이스 업데이트
    await db.update(admins)
      .set({ password: hashedPassword })
      .where(eq(admins.email, email));
    
    console.log('관리자 비밀번호 업데이트 완료');
  } catch (error) {
    console.error('관리자 비밀번호 업데이트 오류:', error);
  }
};

updateAdminPassword();
