"use client";
import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let client: any = null;

export function createClient() {
  // 싱글톤 패턴으로 클라이언트 재사용
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return client;
}

// 서버사이드용 Supabase 클라이언트
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

console.log('Supabase 환경변수 확인:');
console.log('URL:', supabaseUrl ? '설정됨' : '설정되지 않음');
console.log('ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음');

// 기본 Supabase 클라이언트 (서버사이드에서 사용)
export const supabase = supabaseUrl && supabaseAnonKey ? createSupabaseClient(
  supabaseUrl,
  supabaseAnonKey
) : null;

// 서버사이드용 Supabase 클라이언트 (Service Role Key 사용)
export const supabaseAdmin = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 데이터베이스 상태 확인 함수
export async function getDatabaseStatus() {
  try {
    if (!supabase) {
      throw new Error('Supabase 클라이언트가 초기화되지 않았습니다.');
    }

    const { data, error } = await supabase
      .from('packages')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      throw error;
    }
    
    return {
      status: 'connected',
      timestamp: new Date().toISOString(),
      message: 'Supabase 데이터베이스에 성공적으로 연결되었습니다.',
      package_count: data?.length || 0
    };
  } catch (error) {
    console.error('Supabase 연결 실패:', error);
    return {
      status: 'error',
      message: 'Supabase 데이터베이스 연결에 실패했습니다.',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
