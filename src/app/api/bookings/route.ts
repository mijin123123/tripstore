import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: Request) {
  try {
    console.log('예약 API 호출됨')
    
    const body = await request.json()
    console.log('받은 데이터:', body)

    // Supabase에 실제 예약 데이터 저장
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          package_id: body.packageId,
          start_date: body.startDate,
          quantity: body.quantity || body.peopleCount || 1,
          cost: parseFloat(body.cost || body.totalPrice) || 0,
          total_price: parseFloat(body.totalPrice || body.cost) || 0,
          people_count: body.peopleCount || body.quantity || 1,
          traveler_info: JSON.stringify(body.travelerInfo),
          special_requests: body.specialRequests || null,
          status: 'pending',
          payment_status: 'pending'
        }
      ])
      .select()

    if (error) {
      console.error('데이터베이스 저장 오류:', error)
      return NextResponse.json(
        { error: '예약 저장 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

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
