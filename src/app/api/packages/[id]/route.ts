import { NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Package from '@/models/Package';
import mongoose from 'mongoose';

// 특정 패키지 조회 API
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: 패키지 ID ${params.id} 조회 요청 받음`);
    
    // 환경 변수 확인
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }
    
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    // 숫자 ID가 전달된 경우 순서대로 정렬된 패키지에서 해당 인덱스의 패키지를 찾음
    const numericId = parseInt(params.id);
    
    if (isNaN(numericId) || numericId < 1) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 모든 패키지를 순서대로 가져와서 해당 인덱스의 패키지를 찾음
    const result = await pool.query('SELECT * FROM packages ORDER BY created_at ASC');
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: '패키지가 없습니다.' },
        { status: 404 }
      );
    }
    
    // 인덱스 기반으로 패키지 찾기 (1-based index)
    const packageIndex = numericId - 1;
    
    if (packageIndex >= result.rows.length) {
      console.log(`API: 패키지 ID ${params.id}를 찾을 수 없음`);
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const packageData = result.rows[packageIndex];

    console.log(`API: 패키지 ID ${params.id} 조회 성공`);
    return NextResponse.json(packageData, { status: 200 });
  } catch (error) {
    console.error(`패키지 ID ${params.id} 조회 중 오류:`, error);
    return NextResponse.json(
      { error: '패키지 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 패키지 수정 API
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: 패키지 ID ${params.id} 수정 요청 받음`);
    
    // 환경 변수 확인
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }
    
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    // 숫자 ID 검증
    const numericId = parseInt(params.id);
    
    if (isNaN(numericId) || numericId < 1) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 요청 본문에서 데이터 추출
    const requestData = await request.json();
    console.log('수정 데이터:', requestData);

    // 필수 필드 검증
    const requiredFields = ['title', 'description', 'destination', 'price', 'duration', 'category'];
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return NextResponse.json(
          { error: `${field} 필드가 필요합니다.` },
          { status: 400 }
        );
      }
    }
    
    // 먼저 해당 인덱스의 패키지를 찾음
    const allPackages = await pool.query('SELECT * FROM packages ORDER BY created_at ASC');
    const packageIndex = numericId - 1;
    
    if (packageIndex >= allPackages.rows.length) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const targetPackage = allPackages.rows[packageIndex];

    // 패키지 업데이트
    await pool.query(`
      UPDATE packages
      SET
        title = $1,
        description = $2,
        destination = $3,
        price = $4,
        duration = $5,
        category = $6,
        updated_at = NOW()
      WHERE id = $7
    `, [
      requestData.title,
      requestData.description,
      requestData.destination,
      requestData.price,
      requestData.duration,
      requestData.category,
      targetPackage.id
    ]);

    console.log(`API: 패키지 ID ${params.id} 수정 성공`);
    
    // 수정된 데이터 조회하여 반환
    const updated = await pool.query('SELECT * FROM packages WHERE id = $1 LIMIT 1', [targetPackage.id]);
    
    return NextResponse.json(updated.rows[0], { status: 200 });
  } catch (error) {
    console.error(`패키지 ID ${params.id} 수정 중 오류:`, error);
    return NextResponse.json(
      { error: '패키지 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 패키지 삭제 API
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: 패키지 ID ${params.id} 삭제 요청 받음`);
    
    // 환경 변수 확인
    if (!process.env.NEON_DATABASE_URL) {
      console.error('NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }
    
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    
    // 숫자 ID 검증
    const numericId = parseInt(params.id);
    
    if (isNaN(numericId) || numericId < 1) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID입니다.' },
        { status: 400 }
      );
    }
    
    // 먼저 해당 인덱스의 패키지를 찾음
    const allPackages = await pool.query('SELECT * FROM packages ORDER BY created_at ASC');
    const packageIndex = numericId - 1;
    
    if (packageIndex >= allPackages.rows.length) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    const targetPackage = allPackages.rows[packageIndex];
    
    // DB에서 해당 ID의 패키지 삭제
    await pool.query('DELETE FROM packages WHERE id = $1', [targetPackage.id]);
    
    console.log(`API: 패키지 ID ${params.id} 삭제 성공`);
    return NextResponse.json(
      { success: true, message: '패키지가 성공적으로 삭제되었습니다.' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`패키지 ID ${params.id} 삭제 중 오류:`, error);
    return NextResponse.json(
      { error: '패키지 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
