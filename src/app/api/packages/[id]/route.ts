import { db } from '@/lib/neon';
import { packages } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log('패키지 조회 요청 ID:', id);
    
    if (!id) {
      console.log('패키지 ID가 없습니다');
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }
    
    console.log('데이터베이스에서 패키지 조회 중...');
    
    // 더미 데이터 처리 (pkg-로 시작하는 ID는 더미 데이터로 간주)
    if (id.startsWith('pkg-')) {
      console.log('더미 데이터 ID 감지:', id);
      
      // 더미 패키지 데이터
      const dummyPackages = [
        {
          id: 'pkg-001',
          title: '제주도 3박 4일',
          description: '아름다운 제주도의 자연을 만끽하는 여행',
          price: 350000,
          duration: 3,
          departuredate: ["2024-07-15", "2024-07-22", "2024-08-05"],
          images: ["https://source.unsplash.com/featured/?jeju"],
          destination: '제주도',
          category: '국내여행',
          inclusions: ["숙박", "일부 식사", "가이드"],
          exclusions: ["개인 경비", "선택 관광"],
          isfeatured: true,
          isonsale: false
        },
        {
          id: 'pkg-002',
          title: '도쿄 핵심 관광',
          description: '도쿄의 주요 명소를 모두 둘러보는 알찬 일정',
          price: 750000,
          duration: 4,
          departuredate: ["2024-08-10", "2024-09-05"],
          images: ["https://source.unsplash.com/featured/?tokyo"],
          destination: '일본, 도쿄',
          category: '해외여행',
          inclusions: ["항공", "숙박", "조식"],
          exclusions: ["개인 경비", "선택 관광"],
          isfeatured: true,
          isonsale: true
        }
      ];
      
      const packageData = dummyPackages.find(pkg => pkg.id === id);
      
      if (!packageData) {
        console.log('더미 패키지를 찾을 수 없음:', id);
        return NextResponse.json({ error: 'Package not found' }, { status: 404 });
      }
      
      return NextResponse.json(packageData);
    }
    
    // 실제 DB 조회
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
    
    console.log('패키지 업데이트 요청 ID:', id);
    console.log('요청 본문:', JSON.stringify(body).substring(0, 200) + '...');
    
    // 데이터 타입 변환 처리
    const formattedData = {
      ...body,
      // 숫자 필드 변환
      price: body.price ? body.price.toString() : undefined, // decimal 타입에 맞게 문자열로 저장
      discountprice: body.discountprice ? body.discountprice.toString() : undefined,
      rating: body.rating ? body.rating.toString() : undefined,
      // 배열 필드 확인
      images: Array.isArray(body.images) ? body.images : (body.images ? [body.images] : []),
      inclusions: Array.isArray(body.inclusions) ? body.inclusions : [],
      exclusions: Array.isArray(body.exclusions) ? body.exclusions : [],
      // 날짜 필드 확인
      updated_at: new Date()
    };
    
    console.log('변환된 데이터:', JSON.stringify(formattedData).substring(0, 200) + '...');
    
    // 더미 데이터 처리 (pkg-로 시작하는 ID는 더미 데이터로 간주)
    if (id.startsWith('pkg-')) {
      console.log('더미 데이터 패키지 업데이트 요청:', id);
      
      // 더미 데이터는 업데이트 성공으로 가정하고 응답
      const updatedPackage = {
        ...formattedData,
        id: id,
        updated_at: new Date().toISOString()
      };
      
      return NextResponse.json(updatedPackage);
    }
    
    // 실제 DB 업데이트
    const [updatedPackage] = await db
      .update(packages)
      .set(formattedData)
      .where(eq(packages.id, id))
      .returning();

    if (!updatedPackage) {
      return NextResponse.json({ error: 'Package not found or no permission to update' }, { status: 404 });
    }

    console.log('패키지 업데이트 성공:', updatedPackage.id);
    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    console.log('패키지 삭제 요청 ID:', id);

    // 더미 데이터 처리 (pkg-로 시작하는 ID는 더미 데이터로 간주)
    if (id.startsWith('pkg-')) {
      console.log('더미 데이터 패키지 삭제 요청:', id);
      // 더미 데이터는 삭제 성공으로 가정하고 응답
      return NextResponse.json({ success: true, message: 'Package deleted successfully' });
    }

    // 실제 DB에서 삭제
    const [deletedPackage] = await db
      .delete(packages)
      .where(eq(packages.id, id))
      .returning();

    if (!deletedPackage) {
      return NextResponse.json({ error: 'Package not found or no permission to delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
