import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      packageId,
      departureDate,
      travelerCount,
      travelerInfo,
      specialRequests,
      totalAmount,
      userId
    } = body

    console.log('예약 요청 데이터:', body)

    const supabase = createServerClient()

    // 임시 사용자 ID 생성 (실제로는 인증된 사용자 ID를 사용해야 함)
    const tempUserId = userId || '00000000-0000-0000-0000-000000000000'

    // 예약 데이터 삽입
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          user_id: tempUserId,
          package_id: packageId,
          booking_date: new Date().toISOString(),
          start_date: departureDate,
          quantity: travelerCount,
          cost: totalAmount,
          status: 'pending',
          payment_status: 'pending',
          special_requests: specialRequests,
          people_count: travelerCount,
          total_price: totalAmount,
          traveler_info: JSON.stringify(travelerInfo) // 여행자 정보를 JSON으로 저장
        }
      ])
      .select()

    if (error) {
      console.error('예약 생성 오류:', error)
      return NextResponse.json(
        { error: '예약 생성 중 오류가 발생했습니다.', details: error.message },
        { status: 500 }
      )
    }

    console.log('예약 생성 성공:', data)

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
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        users (name, email),
        packages (name, image)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('예약 조회 오류:', error)
      return NextResponse.json(
        { error: '예약 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings: data }, { status: 200 })

  } catch (error) {
    console.error('예약 조회 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
