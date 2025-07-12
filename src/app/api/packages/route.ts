import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Package from '@/models/Package';
import { mockPackages } from '@/lib/mock-data';

// Node.js Runtime 명시 (MongoDB 연결을 위해)
export const runtime = 'nodejs';

export const dynamic = 'force-dynamic';

// MongoDB 연결 및 패키지 조회 함수 (Netlify 서버리스 환경 최적화)
async function getPackagesFromMongoDB(retries = 2) {
  // 빠른 타임아웃으로 MongoDB 연결 요청
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('MongoDB 연결 타임아웃 (8초)')), 8000);
  });
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 MongoDB 연결 시도 ${attempt}/${retries} (Netlify 최적화)...`);
      
      // 경쟁 조건: MongoDB 연결이 먼저 성공하면 해당 결과 반환, 타임아웃되면 에러 발생
      const mongooseConn = await Promise.race([
        connectMongoDB(),
        timeoutPromise
      ]);
      
      // 기본 정렬과 필드 제한으로 쿼리 최적화
      const packages = await Package.find({})
        .select('title description destination price duration category image_url featured available createdAt updatedAt')
        .sort({ createdAt: -1 })
        .limit(100) // 결과 제한으로 응답 크기 축소
        .lean(); // 성능 최적화를 위해 lean() 사용
      
      console.log(`✅ MongoDB 연결 성공! ${packages?.length || 0}개 패키지 조회 (제한: 100)`);
      return packages || [];
      
    } catch (error) {
      console.error(`❌ MongoDB 연결 시도 ${attempt} 실패:`, error);
      if (attempt === retries) throw error;
      // 재시도 간격을 짧게 조정 (서버리스 함수 타임아웃 고려)
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

export async function GET() {
  try {
    console.log('🌟 === API: 패키지 목록 조회 요청 받음 (MongoDB v3.2 Netlify 최적화) ===');
    console.log('🔧 환경변수 상태:');
    
    const mongoUri = process.env.MONGODB_URI;
    const nodeEnv = process.env.NODE_ENV;
    const isNetlify = process.env.NETLIFY === 'true';
    
    console.log('- MONGODB_URI:', !!mongoUri, mongoUri ? `(${mongoUri.substring(0, 20)}...)` : '');
    console.log('- NODE_ENV:', nodeEnv);
    console.log('- NETLIFY:', isNetlify);
    console.log('- Mock 데이터 길이:', mockPackages.length);
    
    // 환경변수 체크 먼저 수행
    if (!mongoUri) {
      console.error('❌ MONGODB_URI 환경변수가 설정되지 않았습니다!');
      console.error('🔍 사용 가능한 환경변수:', Object.keys(process.env).filter(key => key.includes('MONGO')));
      
      // MongoDB URI가 없으면 바로 Mock 데이터 반환
      console.log('🔄 환경변수 없음 - Mock 데이터로 대체');
      return NextResponse.json(mockPackages, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache', 
          'Expires': '0',
          'Content-Type': 'application/json',
          'X-Package-Count': mockPackages.length.toString(),
          'X-Data-Source': 'mock-no-env'
        }
      });
    }
    
    // MongoDB 연결 시도
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
      console.error('🔍 오류 상세:', mongoError instanceof Error ? mongoError.message : mongoError);
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
