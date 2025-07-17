import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, agreeTerms, agreePrivacy, agreeMarketing } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '필수 정보를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    if (!agreeTerms || !agreePrivacy) {
      return NextResponse.json(
        { error: '이용약관과 개인정보처리방침에 동의해주세요.' },
        { status: 400 }
      )
    }

    // 이메일 중복 확인
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: '이미 사용중인 이메일입니다.' },
        { status: 409 }
      )
    }

    // 비밀번호 해싱
    const passwordHash = await bcrypt.hash(password, 12)

    // 사용자 생성
    const { data: newUser, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name: name.trim(),
          email: email,
          phone: phone,
          password_hash: passwordHash,
          email_verified: true, // 이메일 인증 없이 바로 활성화
          agree_terms: agreeTerms,
          agree_privacy: agreePrivacy,
          agree_marketing: agreeMarketing || false,
          status: 'active'
        }
      ])
      .select('*')
      .single()

    if (error) {
      console.error('사용자 생성 오류:', error)
      return NextResponse.json(
        { error: '회원가입 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    // 비밀번호 해시 제외하고 사용자 정보 반환
    const { password_hash, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: '회원가입이 완료되었습니다.'
    })
  } catch (error) {
    console.error('회원가입 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
