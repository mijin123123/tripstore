// Supabase에서 bookings 테이블 생성
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ihhenvmzizaiokrfkatwt.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.C9CmGqD7p4n6BjsLX_wbUoTvpyLKWWpOJOmCnFhE4zQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBookingsTable() {
  try {
    console.log('bookings 테이블 생성 시도...');
    
    // SQL을 통해 테이블 생성
    const { data, error } = await supabase.rpc('sql', {
      query: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          package_id TEXT,
          booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          start_date DATE,
          quantity INTEGER DEFAULT 1,
          cost DECIMAL(10,2) NOT NULL DEFAULT 0,
          status TEXT DEFAULT 'pending',
          payment_status TEXT DEFAULT 'pending',
          special_requests TEXT,
          people_count INTEGER DEFAULT 1,
          total_price DECIMAL(10,2) DEFAULT 0,
          traveler_info TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
      `
    });

    if (error) {
      console.error('테이블 생성 오류:', error);
    } else {
      console.log('테이블 생성 성공 또는 이미 존재함');
    }

    // 테이블 확인
    const { data: testData, error: testError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (testError) {
      console.error('테이블 접근 오류:', testError);
    } else {
      console.log('테이블 접근 성공, 데이터 수:', testData?.length || 0);
    }

  } catch (err) {
    console.error('전체 오류:', err);
  }
}

createBookingsTable();
