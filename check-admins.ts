import { db } from './src/lib/neon';
import { admins } from './src/lib/schema';

async function checkAdmins() {
  try {
    console.log('=== 관리자 계정 확인 ===');
    
    const adminList = await db
      .select()
      .from(admins);
    
    console.log('등록된 관리자 계정 목록:');
    adminList.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.email} (생성일: ${admin.createdAt})`);
    });
    
  } catch (error) {
    console.error('관리자 계정 확인 중 오류:', error);
  }
}

checkAdmins().then(() => {
  console.log('확인 완료');
  process.exit(0);
});
