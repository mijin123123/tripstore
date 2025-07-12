import { NextRequest, NextResponse } from 'next/server';
import connectMongoDB from '@/lib/mongodb';
import Package from '@/models/Package';
import mongoose from 'mongoose';

// Node.js Runtime 명시 (MongoDB 연결을 위해)
export const runtime = 'nodejs';

// 특정 패키지 조회 API
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: 패키지 ID ${params.id} 조회 요청 받음`);
    
    // MongoDB 연결
    await connectMongoDB();
    
    const { id } = params;
    
    // MongoDB ObjectId 형식 확인
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    // 패키지 조회
    const packageData = await Package.findById(id);
    
    if (!packageData) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 응답 데이터 변환
    const responseData = {
      id: packageData._id.toString(),
      title: packageData.title,
      description: packageData.description,
      price: packageData.price,
      duration: packageData.duration,
      location: packageData.location,
      image_url: packageData.image_url,
      includes: packageData.includes,
      available_dates: packageData.available_dates,
      created_at: packageData.created_at
    };
    
    console.log(`패키지 조회 성공: ${packageData.title}`);
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('패키지 조회 API 오류:', error);
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
    
    // MongoDB 연결
    await connectMongoDB();
    
    const { id } = params;
    
    // MongoDB ObjectId 형식 확인
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // 패키지 업데이트
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 응답 데이터 변환
    const responseData = {
      id: updatedPackage._id.toString(),
      title: updatedPackage.title,
      description: updatedPackage.description,
      price: updatedPackage.price,
      duration: updatedPackage.duration,
      location: updatedPackage.location,
      image_url: updatedPackage.image_url,
      includes: updatedPackage.includes,
      available_dates: updatedPackage.available_dates,
      created_at: updatedPackage.created_at
    };
    
    console.log(`패키지 수정 성공: ${updatedPackage.title}`);
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('패키지 수정 API 오류:', error);
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
    
    // MongoDB 연결
    await connectMongoDB();
    
    const { id } = params;
    
    // MongoDB ObjectId 형식 확인
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    // 패키지 삭제
    const deletedPackage = await Package.findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    console.log(`패키지 삭제 성공: ${deletedPackage.title}`);
    return NextResponse.json({ 
      message: '패키지가 성공적으로 삭제되었습니다.',
      id: deletedPackage._id.toString()
    });
    
  } catch (error) {
    console.error('패키지 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '패키지 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
