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

    // 사용자 세션 확인 (임시로 간단하게 처리)
    let userId = null // UUID 타입 오류 방지를 위해 null로 설정
    try {
      // Authorization 헤더에서 사용자 정보 확인
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.includes('Bearer')) {
        // 실제 구현에서는 JWT 토큰을 디코드해야 함
        // userId = 'authenticated-user' // UUID가 아니므로 주석 처리
      }
    } catch (error) {
      console.log('사용자 인증 실패, null로 처리')
    }

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

    // 데이터 변환 - 실제 테이블 구조에 맞춤
    const insertData = {
      user_id: userId, // 사용자 ID 추가
      package_id: body.packageId || 'unknown',
      villa_id: null, // NULL 허용
      booking_date: new Date().toISOString().split('T')[0], // DATE 형식
      start_date: body.startDate || '2025-08-01', // 출발일
      end_date: null, // NULL 허용
      people_count: body.peopleCount || body.quantity || 1, // 인원수
      total_price: parseFloat(body.totalPrice || body.cost) || 0,
      special_requests: JSON.stringify({
        travelerInfo: body.travelerInfo || null,
        specialRequests: body.specialRequests || '',
        allTravelers: body.allTravelers || []
      })
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

export async function GET(request: Request) {
  try {
    console.log('예약 목록 조회 API 호출됨')
    
    // URL에서 사용자 ID 파라미터 확인
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    
    // 사용자 ID가 있으면 해당 사용자의 예약만 조회
    if (userId) {
      query = query.eq('user_id', userId)
      console.log(`사용자 ${userId}의 예약만 조회`)
    }
    
    // Supabase에서 실제 예약 데이터 가져오기
    const { data, error } = await query

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

export async function PATCH(request: Request) {
  try {
    console.log('예약 업데이트 API 호출됨')
    
    const body = await request.json()
    console.log('받은 업데이트 데이터:', JSON.stringify(body, null, 2))

    // 필수 필드 검증
    if (!body.id) {
      return NextResponse.json(
        { error: '예약 ID는 필수입니다.' },
        { status: 400 }
      )
    }

    // 업데이트할 필드만 추출
    const updateData: any = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.payment_status !== undefined) updateData.payment_status = body.payment_status
    if (body.special_requests !== undefined) updateData.special_requests = body.special_requests

    console.log('업데이트할 데이터:', JSON.stringify(updateData, null, 2))

    // Supabase에서 예약 업데이트
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', body.id)
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
