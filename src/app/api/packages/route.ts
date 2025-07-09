import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getAllPackagesFromNeon, testNeonConnection } from '@/lib/neon-api';
import { packagesData } from '@/data/packagesData';
import { Pool } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('API: 패키지 목록 조회 요청 받음');
    
    // 네온DB 연결 테스트
    const isNeonConnected = await testNeonConnection();
    
    if (isNeonConnected) {
      // 네온DB에서 데이터 조회 시도
      try {
        console.log('네온DB에서 패키지 데이터 조회 시도...');
        
        // 관리자 페이지용으로 원본 데이터베이스 스키마를 반환
        const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
        const result = await pool.query('SELECT * FROM packages ORDER BY created_at DESC');
        
        // 데이터를 관리자 페이지에서 사용하기 쉽도록 ID 추가
        const packages = result.rows.map((pkg: any, index: number) => ({
          ...pkg,
          id: (index + 1).toString(), // 숫자 ID를 문자열로 변환
        }));
        
        if (packages && packages.length > 0) {
          console.log(`API: ${packages.length}개의 패키지 조회 성공 (네온DB)`);
          return NextResponse.json(packages);
        } else {
          console.log('네온DB에서 패키지가 없음, 기본 데이터 사용');
          console.log(`API: ${packagesData.length}개의 기본 패키지 데이터 사용`);
          return NextResponse.json(packagesData);
        }
      } catch (dbError) {
        console.error('네온DB 조회 오류:', dbError);
        console.log('기본 패키지 데이터로 대체');
        return NextResponse.json(packagesData);
      }
    } else {
      console.log('네온DB 연결 실패, 기본 데이터 사용');
      return NextResponse.json(packagesData);
    }
    
  } catch (error) {
    console.error('패키지 API 오류:', error);
    
    // 모든 오류 시 기본 데이터 반환
    return NextResponse.json(packagesData);
  }
}

export async function POST(request: Request) {
  try {
    const packageData = await request.json();
    
    // 관리자 권한 확인 (향후 구현)
    
    const supabase = createClient();
    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();
    
    if (error) {
      console.error('패키지 생성 오류:', error);
      return NextResponse.json(
        { error: '패키지 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('패키지 생성 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
