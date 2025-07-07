// 관리자 계정 확인 및 생성 스크립트
import { db } from '../src/lib/neon.js';
import { admins } from '../src/lib/schema.js';
import bcrypt from 'bcryptjs';

const checkAndCreateAdmin = async () => {
  try {
    console.log('데이터베이스 연결 테스트...');
    
    // 관리자 테이블 확인
    const existingAdmins = await db.select().from(admins);
    console.log('기존 관리자 계정:', existingAdmins);
    
    const adminEmail = 'sonchanmin89@gmail.com';
    const adminPassword = 'admin123';
    
    // 관리자 계정이 없으면 생성
    const existing = existingAdmins.find(admin => admin.email === adminEmail);
    if (!existing) {
      console.log('관리자 계정 생성 중...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await db.insert(admins).values({
        email: adminEmail,
        password: hashedPassword
      });
      
      console.log('관리자 계정 생성 완료');
    } else {
      console.log('관리자 계정이 이미 존재함');
      
      // 비밀번호 업데이트
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.update(admins)
        .set({ password: hashedPassword })
        .where(eq(admins.email, adminEmail));
      
      console.log('관리자 비밀번호 업데이트 완료');
    }
    
    // 최종 확인
    const finalAdmins = await db.select().from(admins);
    console.log('최종 관리자 계정:', finalAdmins);
    
  } catch (error) {
    console.error('오류 발생:', error);
  }
};

checkAndCreateAdmin();
