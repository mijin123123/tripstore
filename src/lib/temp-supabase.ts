import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 설정 (임시로 사용)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// 패키지 데이터 가져오기 (임시 함수)
export async function getPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('패키지 데이터 가져오기 실패:', error);
    return [];
  }
  
  return data || [];
}

// 사용자 예약 데이터 가져오기 (임시 함수)
export async function getUserReservations(userId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(`
      *,
      packages (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('예약 데이터 가져오기 실패:', error);
    return [];
  }
  
  return data || [];
}
