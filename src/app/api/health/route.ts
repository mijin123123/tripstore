import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // 데이터베이스 연결 테스트
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count(*)')
      .limit(1)

    if (error) {
      console.error('데이터베이스 연결 오류:', error)
      return NextResponse.json({
        status: 'error',
        message: '데이터베이스 연결 실패',
        error: error.message
      }, { status: 500 })
    }

    // 테이블 구조 확인
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    return NextResponse.json({
      status: 'success',
      message: '데이터베이스 연결 성공',
      userCount: data,
      tableStructure: tableInfo ? Object.keys(tableInfo[0] || {}) : [],
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API 오류:', error)
    return NextResponse.json({
      status: 'error',
      message: 'API 호출 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
}
