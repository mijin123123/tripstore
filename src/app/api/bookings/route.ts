import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ihhnvmzizaiokrfkatwt.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.C9CmGqD7p4n6BjsLX_wbUoTvpyLKWWpOJOmCnFhE4zQ'

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

    // Service role key로 클라이언트 생성 (RLS 우회)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // 임시 사용자 ID 생성
    const tempUserId = userId || '00000000-0000-0000-0000-000000000000'

    // 먼저 bookings 테이블이 존재하는지 확인
    const { data: tableExists, error: tableError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1)

    if (tableError && tableError.message.includes('relation "public.bookings" does not exist')) {
      console.error('bookings 테이블이 존재하지 않습니다.')
      return NextResponse.json(
        { 
          error: 'bookings 테이블이 존재하지 않습니다. Supabase SQL Editor에서 테이블을 생성해주세요.',
          sql: 'database/create-simple-bookings.sql 파일을 실행하세요.'
        },
        { status: 500 }
      )
    }

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
          special_requests: specialRequests || '',
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
      { error: '서버 오류가 발생했습니다.', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Service role key로 클라이언트 생성 (RLS 우회)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

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
