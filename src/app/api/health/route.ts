import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Node.js Runtime 명시
export const runtime = 'nodejs';

export async function GET() {
  try {
    // 환경변수 확인
    const jwtSecret = process.env.JWT_SECRET;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const nodeEnv = process.env.NODE_ENV || 'development';
    
    console.log('🔍 Health Check 시작...');
    console.log('📋 환경 정보:', {
      nodeEnv,
      jwtSecretExists: !!jwtSecret,
      supabaseUrlExists: !!supabaseUrl,
      supabaseKeyExists: !!supabaseKey
    });
    
    const envStatus = {
      jwt: jwtSecret ? '✅ 설정됨' : '❌ 누락됨',
      supabase_url: supabaseUrl ? '✅ 설정됨' : '❌ 누락됨',
      supabase_key: supabaseKey ? '✅ 설정됨' : '❌ 누락됨',
      nodeEnv: nodeEnv,
      timestamp: new Date().toISOString()
    };

    // Supabase 연결 테스트
    let dbStatus = '❌ 연결 실패';
    let dbError = null;
    
    if (supabaseUrl && supabaseKey) {
      try {
        console.log('📡 Supabase 연결 테스트 시작...');
        
        // 간단한 쿼리로 연결 테스트
        const { data, error } = await supabaseAdmin
          .from('users')
          .select('count(*)')
          .limit(1);
        
        if (error) {
          dbStatus = '❌ 연결 오류';
          dbError = error.message;
          console.error('❌ Supabase 연결 오류:', error);
        } else {
          dbStatus = '✅ 연결 성공';
          console.log('✅ Supabase 연결 성공!');
        }
      } catch (error) {
        console.error('❌ Supabase 연결 실패:', error);
        dbStatus = '❌ 연결 실패';
        dbError = error instanceof Error ? error.message : 'Unknown error';
      }
    } else {
      dbError = 'Supabase 환경변수가 설정되지 않음';
    }

    const response = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: envStatus,
      database: {
        status: dbStatus,
        error: dbError,
        type: 'Supabase (PostgreSQL)'
      },
      runtime: 'nodejs',
      version: process.version
    };

    console.log('📤 Health Check 응답:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('💥 Health check 오류:', error);
    return NextResponse.json(
      { 
        status: 'ERROR', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        runtime: 'nodejs'
      },
      { status: 500 }
    );
  }
}
