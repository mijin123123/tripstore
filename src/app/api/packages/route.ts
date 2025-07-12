import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { mockPackages } from '@/lib/mock-data';

// Node.js Runtime 명시 (MongoDB 연결을 위해)
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

// MongoDB 연결 및 패키지 조회 함수
async function getPackagesFromMongoDB(retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`� MongoDB 연결 시도 ${attempt}/${retries}...`);
      
      await connectMongoDB();
      
      const packages = await Package.find({})
        .sort({ createdAt: -1 })
        .lean(); // 성능 최적화를 위해 lean() 사용
      
      console.log(`✅ MongoDB 연결 성공! ${packages?.length || 0}개 패키지 조회`);
      return packages || [];
      
    } catch (error) {
      console.error(`❌ MongoDB 연결 시도 ${attempt} 실패:`, error);
      if (attempt === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}

export async function GET() {
  try {
    console.log('🌟 === API: 패키지 목록 조회 요청 받음 (MongoDB v3.0) ===');
    console.log('🔧 환경변수 상태:');
    console.log('- MONGODB_URI:', !!process.env.MONGODB_URI);
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- Mock 데이터 길이:', mockPackages.length);
    
    // MongoDB 우선 연결 시도
    try {
      const packages = await getPackagesFromMongoDB(3);
      
      if (packages && packages.length > 0) {
        console.log(`🎉 SUCCESS: ${packages.length}개의 패키지 반환 (MongoDB)`);
        console.log(`📈 API 응답 크기: ${JSON.stringify(packages).length} bytes`);
        
        // MongoDB 데이터를 프론트엔드 형식으로 변환
        const formattedPackages = packages.map(pkg => ({
          id: pkg._id?.toString(), // MongoDB _id를 문자열로 변환
          _id: pkg._id?.toString(), // 호환성을 위해 _id도 포함
          title: pkg.title,
          description: pkg.description,
          destination: pkg.destination,
          price: pkg.price,
          duration: pkg.duration,
          category: pkg.category,
          image_url: pkg.image_url,
          featured: pkg.featured,
          available: pkg.available,
          createdAt: pkg.createdAt,
          updatedAt: pkg.updatedAt
        }));
        
        // 패키지 데이터 샘플 로깅
        console.log('📦 첫 번째 패키지 샘플:', {
          id: formattedPackages[0]?.id,
          title: formattedPackages[0]?.title,
          category: formattedPackages[0]?.category,
          price: formattedPackages[0]?.price
        });
        
        return NextResponse.json(formattedPackages, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Content-Type': 'application/json',
            'X-Package-Count': formattedPackages.length.toString(),
            'X-Data-Source': 'mongodb'
          }
        });
      } else {
        console.log('⚠️ MongoDB에서 데이터가 없음 - Mock 데이터로 fallback');
        console.log(`📦 Mock 데이터 개수: ${mockPackages.length}개`);
        return NextResponse.json(mockPackages, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache', 
            'Expires': '0',
            'Content-Type': 'application/json',
            'X-Package-Count': mockPackages.length.toString(),
            'X-Data-Source': 'mock-fallback'
          }
        });
      }
    } catch (mongoError) {
      console.error('❌ MongoDB 연결 최종 실패:', mongoError);
      console.log(`📦 Fallback: Mock 데이터 ${mockPackages.length}개 반환`);
      console.log('📦 Mock 데이터 샘플:', {
        id: mockPackages[0]?.id,
        title: mockPackages[0]?.title,
        total: mockPackages.length
      });
      
      return NextResponse.json(mockPackages, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Content-Type': 'application/json',
          'X-Package-Count': mockPackages.length.toString(),
          'X-Data-Source': 'mock-error-fallback'
        }
      });
    }
    
  } catch (error) {
    console.error('💥 API 전체 오류:', error);
    // 에러가 발생해도 Mock 데이터를 반환하여 사이트가 동작하도록 함
    console.log('🆘 최종 fallback: Mock 데이터 사용');
    console.log(`📦 최종 Mock 데이터 개수: ${mockPackages.length}개`);
    return NextResponse.json(mockPackages, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Content-Type': 'application/json',
        'X-Package-Count': mockPackages.length.toString(),
        'X-Data-Source': 'mock-final-fallback'
      }
    });
  }
}

export async function POST(request: Request) {
  try {
    const packageData = await request.json();
    
    console.log('📝 새 패키지 생성 요청:', packageData.title);
    
    // MongoDB 연결 및 데이터 생성
    await connectMongoDB();
    
    const newPackage = await Package.create(packageData);
    
    console.log('✅ 새 패키지 생성 성공:', newPackage._id);
    
    return NextResponse.json(newPackage, { status: 201 });
    
  } catch (error) {
    console.error('❌ 패키지 생성 오류:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid package data', details: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create package' },
      { status: 500 }
    );
  }
}
