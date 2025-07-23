import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 환경변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

console.log('Supabase URL:', supabaseUrl ? 'SET' : 'NOT SET')
console.log('Supabase Key:', supabaseKey ? 'SET' : 'NOT SET')

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다')
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function POST(request: Request) {
  try {
    console.log('예약 API 호출됨')
    
    const body = await request.json()
    console.log('받은 데이터:', JSON.stringify(body, null, 2))

    // 필수 필드 검증
    if (!body.packageId) {
      console.error('packageId가 없습니다')
      return NextResponse.json(
        { error: 'packageId는 필수입니다.' },
        { status: 400 }
      )
    }

    if (!body.totalPrice && !body.cost) {
      console.error('가격 정보가 없습니다')
      return NextResponse.json(
        { error: '가격 정보는 필수입니다.' },
        { status: 400 }
      )
    }

    // 데이터 변환 - 최소한의 필드만 사용
    const insertData = {
      user_id: '00000000-0000-0000-0000-000000000000', // 기본 UUID
      package_id: body.packageId || 'unknown',
      booking_date: new Date().toISOString(), // 현재 시간
      start_date: body.startDate || '2025-08-01', // 출발일
      total_price: parseFloat(body.totalPrice || body.cost) || 0
    }

    console.log('최종 삽입할 데이터:', JSON.stringify(insertData, null, 2))

    // Supabase에 실제 예약 데이터 저장
    const { data, error } = await supabase
      .from('bookings')
      .insert([insertData])
      .select()

    if (error) {
      console.error('데이터베이스 저장 오류:', error)
      return NextResponse.json(
        { error: '예약 저장 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    console.log('저장 성공:', data)
    return NextResponse.json(
      { 
        message: '예약이 성공적으로 생성되었습니다.',
        booking: data[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('예약 API 오류:', error)
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('예약 목록 조회 API 호출됨')
    
    // Supabase에서 실제 예약 데이터 가져오기
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('데이터베이스 조회 오류:', error)
      return NextResponse.json(
        { error: '예약 데이터 조회 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    console.log(`총 ${data?.length || 0}개의 예약을 찾았습니다.`)
    
    // 예약 데이터가 없으면 빈 배열 반환
    return NextResponse.json({ 
      bookings: data || [] 
    }, { status: 200 })

  } catch (error) {
    console.error('예약 조회 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
