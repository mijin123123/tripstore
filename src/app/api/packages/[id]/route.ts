import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// 특정 패키지 조회 API
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: 패키지 ID ${params.id} 조회 요청 받음`);
    
    const { id } = params;
    
    // UUID 형식 확인 (간단한 체크)
    if (!id || id.length < 36) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    // 패키지 조회
    const { data: packageData, error } = await supabase
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !packageData) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    console.log(`패키지 조회 성공: ${packageData.title}`);
    return NextResponse.json(packageData);
    
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
    
    const { id } = params;
    
    // UUID 형식 확인
    if (!id || id.length < 36) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    const updateData = await request.json();
    
    // updated_at 자동 설정은 트리거에서 처리됨
    const { data: updatedPackage, error } = await supabase
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !updatedPackage) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없거나 수정에 실패했습니다.' },
        { status: 404 }
      );
    }
    
    console.log(`패키지 수정 성공: ${updatedPackage.title}`);
    return NextResponse.json(updatedPackage);
    
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
    
    const { id } = params;
    
    // UUID 형식 확인
    if (!id || id.length < 36) {
      return NextResponse.json(
        { error: '잘못된 패키지 ID 형식입니다.' },
        { status: 400 }
      );
    }
    
    // 패키지 삭제
    const { data: deletedPackage, error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)
      .select()
      .single();
    
    if (error || !deletedPackage) {
      return NextResponse.json(
        { error: '패키지를 찾을 수 없거나 삭제에 실패했습니다.' },
        { status: 404 }
      );
    }
    
    console.log(`패키지 삭제 성공: ${deletedPackage.title}`);
    return NextResponse.json({ 
      message: '패키지가 성공적으로 삭제되었습니다.',
      id: deletedPackage.id
    });
    
  } catch (error) {
    console.error('패키지 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '패키지 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
