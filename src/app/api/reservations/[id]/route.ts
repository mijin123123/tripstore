import { db } from '@/lib/neon';
import { reservations, packages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const [updatedReservation] = await db
      .update(reservations)
      .set({ 
        status: body.status,
        updatedAt: new Date()
      })
      .where(eq(reservations.id, id))
      .returning();

    if (!updatedReservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const [updatedReservation] = await db
      .update(reservations)
      .set({ 
        contactName: body.contactName || body.contact_name,
        contactEmail: body.contactEmail || body.contact_email,
        contactPhone: body.contactPhone || body.contact_phone,
        travelers: body.travelers,
        status: body.status,
        specialRequests: body.specialRequests || body.special_requests,
        updatedAt: new Date()
      })
      .where(eq(reservations.id, id))
      .returning();

    if (!updatedReservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(updatedReservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log('예약 조회 요청 ID:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 });
    }
    
    const [reservation] = await db
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
      .where(eq(reservations.id, id))
      .limit(1);

    console.log('조회 결과:', reservation);

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
