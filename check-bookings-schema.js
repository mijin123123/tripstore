const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkBookingsTable() {
  try {
    console.log('bookings 테이블 스키마 확인...');
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('오류:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('현재 bookings 테이블 컬럼들:');
      console.log(Object.keys(data[0]));
      console.log('샘플 데이터:');
      console.log(data[0]);
    } else {
      console.log('bookings 테이블에 데이터가 없습니다.');
    }
  } catch (err) {
    console.error('실행 중 오류:', err);
  }
}

checkBookingsTable();
