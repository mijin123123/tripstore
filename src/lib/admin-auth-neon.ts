import { db } from '@/lib/neon';
import { admins } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// 서버 사이드에서 관리자 권한 확인
export async function checkAdminPermission(email: string): Promise<boolean> {
  try {
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);

    return admin.length > 0;
  } catch (error) {
    console.error('관리자 권한 확인 중 오류:', error);
    return false;
  }
}

// 클라이언트 사이드에서 관리자 세션 확인
export function getAdminSession() {
  if (typeof window === 'undefined') return null;
  
  try {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  } catch (error) {
    console.error('관리자 세션 확인 중 오류:', error);
    return null;
  }
}

// 관리자 로그아웃
export function logoutAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminUser');
  }
}
