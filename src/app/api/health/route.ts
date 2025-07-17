import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Health check API 시작')
    
    // 환경변수 확인
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV
    }
    
    console.log('환경변수 확인:', envCheck)

    // 데이터베이스 연결 테스트
    const { count, error } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('데이터베이스 연결 오류:', error)
      return NextResponse.json({
        status: 'error',
        message: '데이터베이스 연결 실패',
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        envCheck
      }, { status: 500 })
    }

    // 테이블 구조 확인
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    console.log('데이터베이스 연결 성공')

    return NextResponse.json({
      status: 'success',
      message: '데이터베이스 연결 성공',
      userCount: count,
      tableStructure: tableInfo ? Object.keys(tableInfo[0] || {}) : [],
      envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({
      status: 'error',
      message: 'API 호출 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
