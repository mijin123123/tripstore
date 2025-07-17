import { supabase } from './supabase'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  agreeTerms: boolean
  agreePrivacy: boolean
  agreeMarketing: boolean
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  name: string
  phone: string | null
  email_verified: boolean
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at: string
}

export class AuthService {
  // 회원가입
  static async signup(data: SignupData): Promise<{ user: User | null; error: string | null }> {
    try {
      // 이메일 중복 확인
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email)
        .single()

      if (existingUser) {
        return { user: null, error: '이미 사용중인 이메일입니다.' }
      }

      // 비밀번호 해싱
      const passwordHash = await bcrypt.hash(data.password, 10)

      // 사용자 생성 (이메일 인증 없이 바로 활성화)
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: data.email,
          name: data.name,
          phone: data.phone,
          password_hash: passwordHash,
          email_verified: true,
          email_verified_at: new Date().toISOString(),
          agree_terms: data.agreeTerms,
          agree_privacy: data.agreePrivacy,
          agree_marketing: data.agreeMarketing,
          status: 'active'
        })
        .select()
        .single()

      if (error) {
        return { user: null, error: '회원가입 중 오류가 발생했습니다.' }
      }

      return { user: newUser, error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { user: null, error: '회원가입 중 오류가 발생했습니다.' }
    }
  }

  // 로그인
  static async login(data: LoginData): Promise<{ user: User | null; error: string | null }> {
    try {
      // 사용자 조회
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .eq('status', 'active')
        .single()

      if (error || !user) {
        await this.logLoginAttempt(null, data.email, false, '존재하지 않는 계정')
        return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(data.password, user.password_hash)

      if (!isPasswordValid) {
        await this.logLoginAttempt(user.id, data.email, false, '비밀번호 불일치')
        return { user: null, error: '이메일 또는 비밀번호가 올바르지 않습니다.' }
      }

      // 로그인 정보 업데이트
      await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: user.login_count + 1
        })
        .eq('id', user.id)

      // 로그인 성공 기록
      await this.logLoginAttempt(user.id, data.email, true)

      return { user, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { user: null, error: '로그인 중 오류가 발생했습니다.' }
    }
  }

  // 이메일 인증 토큰 생성
  static async generateEmailVerificationToken(userId: string): Promise<string> {
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24시간 후 만료

    await supabase
      .from('email_verification_tokens')
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt.toISOString()
      })

    return token
  }

  // 이메일 인증
  static async verifyEmail(token: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: tokenData, error } = await supabase
        .from('email_verification_tokens')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .single()

      if (error || !tokenData) {
        return { success: false, error: '유효하지 않은 인증 토큰입니다.' }
      }

      // 토큰 만료 확인
      if (new Date(tokenData.expires_at) < new Date()) {
        return { success: false, error: '인증 토큰이 만료되었습니다.' }
      }

      // 사용자 이메일 인증 상태 업데이트
      await supabase
        .from('users')
        .update({
          email_verified: true,
          email_verified_at: new Date().toISOString()
        })
        .eq('id', tokenData.user_id)

      // 토큰 사용 처리
      await supabase
        .from('email_verification_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id)

      return { success: true, error: null }
    } catch (error) {
      console.error('Email verification error:', error)
      return { success: false, error: '이메일 인증 중 오류가 발생했습니다.' }
    }
  }

  // 비밀번호 재설정 토큰 생성
  static async generatePasswordResetToken(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (error || !user) {
        return { success: false, error: '존재하지 않는 이메일입니다.' }
      }

      const token = uuidv4()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 1) // 1시간 후 만료

      await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString()
        })

      // 실제 환경에서는 이메일로 토큰을 전송해야 함
      console.log('Password reset token:', token)

      return { success: true, error: null }
    } catch (error) {
      console.error('Password reset token generation error:', error)
      return { success: false, error: '비밀번호 재설정 토큰 생성 중 오류가 발생했습니다.' }
    }
  }

  // 비밀번호 재설정
  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data: tokenData, error } = await supabase
        .from('password_reset_tokens')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .single()

      if (error || !tokenData) {
        return { success: false, error: '유효하지 않은 재설정 토큰입니다.' }
      }

      // 토큰 만료 확인
      if (new Date(tokenData.expires_at) < new Date()) {
        return { success: false, error: '재설정 토큰이 만료되었습니다.' }
      }

      // 새 비밀번호 해싱
      const passwordHash = await bcrypt.hash(newPassword, 10)

      // 비밀번호 업데이트
      await supabase
        .from('users')
        .update({ password_hash: passwordHash })
        .eq('id', tokenData.user_id)

      // 토큰 사용 처리
      await supabase
        .from('password_reset_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id)

      return { success: true, error: null }
    } catch (error) {
      console.error('Password reset error:', error)
      return { success: false, error: '비밀번호 재설정 중 오류가 발생했습니다.' }
    }
  }

  // 로그인 시도 기록
  private static async logLoginAttempt(
    userId: string | null,
    email: string,
    success: boolean,
    failureReason?: string
  ): Promise<void> {
    try {
      await supabase
        .from('user_login_history')
        .insert({
          user_id: userId,
          success,
          failure_reason: failureReason || null,
          // IP 주소와 User Agent는 클라이언트에서 전달받아야 함
          ip_address: null,
          user_agent: null
        })
    } catch (error) {
      console.error('Login attempt logging error:', error)
    }
  }

  // 사용자 정보 조회
  static async getUser(userId: string): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { user: null, error: '사용자 정보를 찾을 수 없습니다.' }
      }

      return { user, error: null }
    } catch (error) {
      console.error('Get user error:', error)
      return { user: null, error: '사용자 정보 조회 중 오류가 발생했습니다.' }
    }
  }

  // 사용자 정보 업데이트
  static async updateUser(userId: string, data: Partial<User>): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { user: null, error: '사용자 정보 업데이트에 실패했습니다.' }
      }

      return { user: updatedUser, error: null }
    } catch (error) {
      console.error('Update user error:', error)
      return { user: null, error: '사용자 정보 업데이트 중 오류가 발생했습니다.' }
    }
  }

  // 이메일 중복 확인
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      return !!data
    } catch (error) {
      return false
    }
  }

  // 만료된 토큰 정리
  static async cleanupExpiredTokens(): Promise<void> {
    try {
      await supabase.rpc('cleanup_expired_tokens')
    } catch (error) {
      console.error('Token cleanup error:', error)
    }
  }
}
