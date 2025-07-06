import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    console.log('패키지 조회 요청 ID:', id);
    
    if (!id) {
      console.log('패키지 ID가 없습니다');
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    
    console.log('데이터베이스에서 패키지 조회 중...');
    const [packageData] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, id));

    console.log('조회 결과:', packageData ? '패키지 찾음' : '패키지 없음');

    if (!packageData) {
      console.log('패키지를 찾을 수 없음:', id);
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    console.log('패키지 반환:', packageData.title);
    return NextResponse.json(packageData);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const [updatedPackage] = await db
      .update(packages)
      .set(body)
      .where(eq(packages.id, id))
      .returning();

    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found or no permission to update' }, { status: 404 });
    }

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
