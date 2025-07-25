import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 환경변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase 환경변수가 설정되지 않았습니다')
}

const supabase = createClient(supabaseUrl!, supabaseKey!)

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('예약 업데이트 API 호출됨, ID:', params.id)
    
    const body = await request.json()
    console.log('받은 데이터:', JSON.stringify(body, null, 2))

    // 필수 필드 검증
    if (!params.id) {
      return NextResponse.json(
        { error: '예약 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 업데이트할 데이터 준비
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // 상태 업데이트
    if (body.status) {
      updateData.status = body.status
    }

    // 결제 상태 업데이트
    if (body.payment_status) {
      updateData.payment_status = body.payment_status
    }

    console.log('업데이트할 데이터:', updateData)

    // 데이터베이스 업데이트
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
      .select()

    if (error) {
      console.error('데이터베이스 업데이트 오류:', error)
      return NextResponse.json(
        { error: '예약 업데이트 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: '해당 예약을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    console.log('업데이트 성공:', data[0])
    return NextResponse.json(
      { 
        message: '예약이 성공적으로 업데이트되었습니다.',
        booking: data[0]
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('예약 업데이트 API 오류:', error)
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('예약 조회 API 호출됨, ID:', params.id)

    if (!params.id) {
      return NextResponse.json(
        { error: '예약 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 데이터베이스에서 예약 조회
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('데이터베이스 조회 오류:', error)
      return NextResponse.json(
        { error: '예약 조회 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { error: '해당 예약을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    console.log('조회 성공:', data)
    return NextResponse.json(
      { 
        message: '예약 조회 성공',
        booking: data
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('예약 조회 API 오류:', error)
    return NextResponse.json(
      { 
        error: '서버 오류가 발생했습니다.', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
