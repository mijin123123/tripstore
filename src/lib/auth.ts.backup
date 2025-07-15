import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

/**
 * 비밀번호 해시 생성
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, SALT_ROUNDS);
}

/**
 * 비밀번호 검증
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword);
}

/**
 * JWT 토큰 생성
 */
export function generateToken(payload: any): string {
  return sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

/**
 * JWT 토큰 검증
 */
export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * 이메일과 비밀번호로 사용자 인증
 */
export async function authenticateUser(email: string, password: string) {
  try {
    // 사용자 조회
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }
    
    // 비밀번호 검증
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' };
    }
    
    // 토큰 생성 및 반환
    const token = generateToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    });
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  } catch (error) {
    console.error('사용자 인증 중 오류 발생:', error);
    return { success: false, message: '인증 중 오류가 발생했습니다.' };
  }
}

/**
 * 관리자 권한 확인
 */
export async function isAdmin(email: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', email)
      .eq('role', 'admin')
      .single();

    return !error && !!user;
  } catch (error) {
    console.error('관리자 권한 확인 중 오류:', error);
    return false;
  }
}
