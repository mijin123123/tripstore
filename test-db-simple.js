// 간단한 Supabase 연결 테스트
const { createClient } = require('@supabase/supabase-js');

// 환경변수 대신 직접 값 사용
const supabaseUrl = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.C9CmGqD7p4n6BjsLX_wbUoTvpyLKWWpOJOmCnFhE4zQ';

console.log('=== Supabase 연결 테스트 시작 ===');
console.log('URL:', supabaseUrl);
console.log('Key 길이:', supabaseKey.length);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n1. 기본 연결 테스트...');
    
    // 1. 간단한 테이블 조회로 연결 확인
    const { data, error } = await supabase
      .from('packages')
      .select('id, name')
      .limit(1);

    if (error) {
      console.log('packages 테이블 조회 오류:', error.message);
    } else {
      console.log('✅ packages 테이블 연결 성공');
      console.log('데이터 샘플:', data);
    }

    console.log('\n2. bookings 테이블 확인...');
    
    // 2. bookings 테이블 존재 확인
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (bookingsError) {
      console.log('❌ bookings 테이블 오류:', bookingsError.message);
      
      if (bookingsError.message.includes('does not exist')) {
        console.log('\n3. bookings 테이블 생성 시도...');
        
        // 3. 테이블이 없으면 생성 시도
        const createTableSQL = `
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
        `;

        const { data: createData, error: createError } = await supabase.rpc('sql', {
          query: createTableSQL
        });

        if (createError) {
          console.log('테이블 생성 실패:', createError.message);
        } else {
          console.log('✅ bookings 테이블 생성 성공');
        }
      }
    } else {
      console.log('✅ bookings 테이블 연결 성공');
      console.log('기존 데이터 수:', bookingsData?.length || 0);
    }

    console.log('\n4. 테스트 데이터 삽입...');
    
    // 4. 테스트 데이터 삽입
    const testBooking = {
      package_id: 'test-package-' + Date.now(),
      start_date: '2025-08-01',
      quantity: 1,
      cost: 100000,
      total_price: 100000,
      people_count: 1,
      traveler_info: JSON.stringify({
        name: '테스트 사용자',
        email: 'test@example.com',
        phone: '010-1234-5678'
      }),
      special_requests: '터미널 테스트',
      status: 'pending',
      payment_status: 'pending'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('bookings')
      .insert([testBooking])
      .select();

    if (insertError) {
      console.log('❌ 데이터 삽입 실패:', insertError.message);
    } else {
      console.log('✅ 테스트 데이터 삽입 성공');
      console.log('삽입된 데이터:', insertData[0]);
    }

    console.log('\n5. 전체 예약 데이터 조회...');
    
    // 5. 전체 예약 데이터 조회
    const { data: allBookings, error: selectError } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (selectError) {
      console.log('❌ 데이터 조회 실패:', selectError.message);
    } else {
      console.log('✅ 전체 예약 데이터 조회 성공');
      console.log('총 예약 수:', allBookings?.length || 0);
      
      if (allBookings && allBookings.length > 0) {
        console.log('최근 예약:');
        allBookings.slice(0, 3).forEach((booking, index) => {
          console.log(`  ${index + 1}. ID: ${booking.id}`);
          console.log(`     패키지: ${booking.package_id}`);
          console.log(`     가격: ${booking.total_price}원`);
          console.log(`     상태: ${booking.status}`);
          console.log(`     생성일: ${booking.created_at}`);
          console.log('');
        });
      }
    }

  } catch (error) {
    console.error('전체 테스트 오류:', error);
  }
}

testConnection();
