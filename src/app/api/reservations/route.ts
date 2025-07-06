import { db } from '@/lib/neon';
import { reservations, packages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 예약 정보와 패키지 정보를 조인하여 조회
    const allReservations = await db
      .select({
        id: reservations.id,
        userId: reservations.userId,
        packageId: reservations.packageId,
        departureDate: reservations.departureDate,
        travelers: reservations.travelers,
        totalPrice: reservations.totalPrice,
        status: reservations.status,
        paymentStatus: reservations.paymentStatus,
        contactName: reservations.contactName,
        contactEmail: reservations.contactEmail,
        contactPhone: reservations.contactPhone,
        specialRequests: reservations.specialRequests,
        createdAt: reservations.createdAt,
        updatedAt: reservations.updatedAt,
        packageTitle: packages.title,
        packageDestination: packages.destination,
      })
      .from(reservations)
      .leftJoin(packages, eq(reservations.packageId, packages.id))
      .orderBy(reservations.createdAt);

    return NextResponse.json(allReservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('예약 생성 요청 시작');
    
    const body = await request.json();
    console.log('받은 예약 데이터:', body);
    
    // 필수 필드 검증
    if (!body.packageId) {
      console.error('패키지 ID가 없습니다');
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    
    if (!body.contactName) {
      console.error('연락처 이름이 없습니다');
      return NextResponse.json({ error: 'Contact name is required' }, { status: 400 });
    }
    
    if (!body.contactEmail) {
      console.error('연락처 이메일이 없습니다');
      return NextResponse.json({ error: 'Contact email is required' }, { status: 400 });
    }
    
    if (!body.departureDate) {
      console.error('출발일이 없습니다');
      return NextResponse.json({ error: 'Departure date is required' }, { status: 400 });
    }
    
    // 데이터 타입 변환 및 검증
    const reservationData = {
      userId: body.userId || null,
      packageId: String(body.packageId),
      departureDate: body.departureDate,
      travelers: parseInt(body.travelers) || 1,
      totalPrice: typeof body.totalPrice === 'string' ? parseInt(body.totalPrice) : body.totalPrice,
      status: body.status || 'pending',
      paymentStatus: body.paymentStatus || 'pending',
      contactName: String(body.contactName),
      contactEmail: String(body.contactEmail),
      contactPhone: String(body.contactPhone || ''),
      specialRequests: body.specialRequests || null,
    };
    
    console.log('변환된 예약 데이터:', reservationData);
    
    // 환경 변수 확인
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.NEON_DATABASE_URL;
    console.log('데이터베이스 URL 존재:', !!databaseUrl);
    
    console.log('데이터베이스에 예약 생성 시도...');
    
    const [newReservation] = await db.insert(reservations).values(reservationData).returning();
    
    console.log('예약 생성 완료:', newReservation);
    
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error('Error creating reservation:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    });
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
