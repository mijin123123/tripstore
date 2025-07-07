import { db } from '@/lib/neon';
import { reservations, packages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// 더미 예약 데이터 (DB 연결 실패 시 사용)
const fallbackReservations = [
  {
    id: "res-001",
    userId: "user-001",
    packageId: "pkg-001",
    departureDate: "2024-08-15",
    travelers: 2,
    totalPrice: 700000,
    status: "confirmed",
    paymentStatus: "paid",
    contactName: "홍길동",
    contactEmail: "hong@example.com",
    contactPhone: "010-1234-5678",
    specialRequests: "창가 자리 요청합니다",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    packageTitle: "제주도 3박 4일",
    packageDestination: "제주도"
  },
  {
    id: "res-002",
    userId: "user-002",
    packageId: "pkg-002",
    departureDate: "2024-07-22",
    travelers: 3,
    totalPrice: 750000,
    status: "pending",
    paymentStatus: "pending",
    contactName: "김철수",
    contactEmail: "kim@example.com",
    contactPhone: "010-9876-5432",
    specialRequests: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    packageTitle: "부산 해운대 2박 3일",
    packageDestination: "부산"
  }
];

export async function GET() {
  try {
    console.log('예약 데이터 요청을 처리 중...');
    
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

    console.log(`${allReservations.length}개의 예약 데이터를 성공적으로 가져왔습니다.`);
    return NextResponse.json(allReservations);
  } catch (error) {
    console.error('예약 데이터 가져오기 실패:', error);
    // 데이터베이스 연결 실패 시 더미 데이터 반환
    console.log('더미 예약 데이터를 대신 반환합니다.');
    return NextResponse.json(fallbackReservations);
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
      return NextResponse.json({ error: '패키지 ID는 필수입니다.' }, { status: 400 });
    }
    
    if (!body.contactName) {
      console.error('연락처 이름이 없습니다');
      return NextResponse.json({ error: '연락처 이름은 필수입니다.' }, { status: 400 });
    }
    
    if (!body.contactEmail) {
      console.error('연락처 이메일이 없습니다');
      return NextResponse.json({ error: '연락처 이메일은 필수입니다.' }, { status: 400 });
    }
    
    if (!body.departureDate) {
      console.error('출발일이 없습니다');
      return NextResponse.json({ error: '출발일은 필수입니다.' }, { status: 400 });
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
    console.log('데이터베이스에 예약 생성 시도...');
    
    const [newReservation] = await db.insert(reservations).values(reservationData).returning();
    
    console.log('예약 생성 완료:', newReservation);
    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error('예약 생성 실패:', error);
    return NextResponse.json(
      { 
        error: '예약을 생성할 수 없습니다.', 
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      }, 
      { status: 500 }
    );
  }
}
