const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcryptjs')

// Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { name, email, phone, password, agreeTerms, agreePrivacy, agreeMarketing } = JSON.parse(event.body)

    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '필수 정보를 모두 입력해주세요.' }),
      }
    }

    if (!agreeTerms || !agreePrivacy) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '이용약관과 개인정보처리방침에 동의해주세요.' }),
      }
    }

    // 이메일 중복 확인
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return {
        statusCode: 409,
        headers,
        body: JSON.stringify({ error: '이미 사용중인 이메일입니다.' }),
      }
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
          email_verified: true,
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '회원가입 중 오류가 발생했습니다.' }),
      }
    }

    // 비밀번호 해시 제외하고 사용자 정보 반환
    const { password_hash, ...userWithoutPassword } = newUser

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        user: userWithoutPassword,
        message: '회원가입이 완료되었습니다.'
      }),
    }
  } catch (error) {
    console.error('회원가입 오류:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '서버 오류가 발생했습니다.' }),
    }
  }
}
