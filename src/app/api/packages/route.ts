import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allPackages = await db.select().from(packages);
    return NextResponse.json(allPackages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [newPackage] = await db.insert(packages).values(body).returning();
    return NextResponse.json(newPackage, { status: 201 });
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
