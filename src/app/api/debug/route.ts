import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('🔍 Debug API 호출됨');
    
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const jwtSecret = process.env.JWT_SECRET;
    
    console.log('🔧 환경 변수 상태:');
    console.log('- SUPABASE_URL:', supabaseUrl ? '설정됨' : '누락됨');
    console.log('- SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '누락됨');
    console.log('- SUPABASE_SERVICE_KEY:', supabaseServiceKey ? '설정됨' : '누락됨');
    console.log('- JWT_SECRET:', jwtSecret ? '설정됨' : '누락됨');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase 환경 변수가 설정되지 않았습니다.',
        env: {
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_ANON_KEY: !!supabaseAnonKey,
          SUPABASE_SERVICE_KEY: !!supabaseServiceKey,
          JWT_SECRET: !!jwtSecret,
          NODE_ENV: process.env.NODE_ENV
        }
      }, { status: 500 });
    }
    
    // Supabase 연결 테스트
    try {
      console.log('🔄 Supabase 연결 테스트 시작...');
      
      // 간단한 쿼리로 연결 테스트
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('count()')
        .limit(1);
      
      if (error) {
        throw error;
      }
      
      console.log('✅ Supabase 연결 성공');
      
      return NextResponse.json({
        status: 'success',
        message: 'Supabase 연결 성공',
        env: {
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_ANON_KEY: !!supabaseAnonKey,
          SUPABASE_SERVICE_KEY: !!supabaseServiceKey,
          JWT_SECRET: !!jwtSecret,
          NODE_ENV: process.env.NODE_ENV
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (dbError: any) {
      console.error('❌ Supabase 연결 실패:', dbError);
      
      return NextResponse.json({
        status: 'error',
        message: 'Supabase 연결 실패',
        error: dbError.message,
        env: {
          SUPABASE_URL: !!supabaseUrl,
          SUPABASE_ANON_KEY: !!supabaseAnonKey,
          SUPABASE_SERVICE_KEY: !!supabaseServiceKey,
          JWT_SECRET: !!jwtSecret,
          NODE_ENV: process.env.NODE_ENV
        },
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
  } catch (error: any) {
    console.error('❌ Debug API 오류:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Debug API 오류',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
