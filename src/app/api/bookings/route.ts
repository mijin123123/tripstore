import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('예약 API 호출됨')
    
    const body = await request.json()
    console.log('받은 데이터:', body)

    // 일단 성공 응답만 반환 (데이터베이스 연결 없이)
    return NextResponse.json(
      { 
        message: '예약이 성공적으로 생성되었습니다.',
        booking: {
          id: 'test-' + Date.now(),
          ...body
        }
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
    
    // 테스트용 더미 데이터 반환
    return NextResponse.json({ 
      bookings: [
        {
          id: 'test-booking-1',
          package_id: 'test-package',
          status: 'pending',
          total_price: 100000,
          created_at: new Date().toISOString()
        }
      ] 
    }, { status: 200 })

  } catch (error) {
    console.error('예약 조회 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
