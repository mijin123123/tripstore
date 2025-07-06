import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    const [packageData] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, id));

    if (!packageData) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

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
