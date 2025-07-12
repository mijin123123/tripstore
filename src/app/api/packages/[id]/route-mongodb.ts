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
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }

    // MongoDB 연결
    await connectMongoDB();

    // ObjectId 형식 검증
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: '올바르지 않은 패키지 ID입니다.' },
        { status: 400 }
      );
    }

    // 패키지 조회
    const packageData = await Package.findById(params.id);

    if (!packageData) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(`✅ 패키지 조회 성공: ${packageData.title}`);

    return NextResponse.json(packageData, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('패키지 조회 오류:', error);
    
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
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
    const updateData = await request.json();
    console.log(`API: 패키지 ID ${params.id} 수정 요청 받음`);

    // MongoDB 연결
    await connectMongoDB();

    // ObjectId 형식 검증
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: '올바르지 않은 패키지 ID입니다.' },
        { status: 400 }
      );
    }

    // 패키지 수정
    const updatedPackage = await Package.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(`✅ 패키지 수정 성공: ${updatedPackage.title}`);

    return NextResponse.json(updatedPackage);

  } catch (error) {
    console.error('패키지 수정 오류:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: '입력 데이터가 올바르지 않습니다.', details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
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

    // MongoDB 연결
    await connectMongoDB();

    // ObjectId 형식 검증
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: '올바르지 않은 패키지 ID입니다.' },
        { status: 400 }
      );
    }

    // 패키지 삭제
    const deletedPackage = await Package.findByIdAndDelete(params.id);

    if (!deletedPackage) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    console.log(`✅ 패키지 삭제 성공: ${deletedPackage.title}`);

    return NextResponse.json({
      message: '패키지가 성공적으로 삭제되었습니다.',
      deletedPackage: {
        id: deletedPackage._id,
        title: deletedPackage.title
      }
    });

  } catch (error) {
    console.error('패키지 삭제 오류:', error);
    
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { error: '데이터베이스 연결 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
