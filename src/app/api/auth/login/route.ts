import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 사용자 조회
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 잘못되었습니다.' },
        { status: 401, headers: corsHeaders }
      )
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 잘못되었습니다.' },
        { status: 401, headers: corsHeaders }
      )
    }

    // 로그인 성공 - 비밀번호 해시 제외하고 사용자 정보 반환
    const { password_hash, ...userWithoutPassword } = user

    // 로그인 카운트 업데이트
    await supabaseAdmin
      .from('users')
      .update({ 
        login_count: (user.login_count || 0) + 1,
        last_login_at: new Date().toISOString()
      })
      .eq('id', user.id)

    return NextResponse.json({
      user: userWithoutPassword,
      message: '로그인 성공'
    }, { headers: corsHeaders })
  } catch (error) {
    console.error('로그인 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500, headers: corsHeaders }
    )
  }
}
