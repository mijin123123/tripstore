const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 클라이언트 생성
const supabaseUrl = 'https://ihhnvmzizaiokrfkatwt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzA4ODU5OSwiZXhwIjoyMDY4NjY0NTk5fQ.C9CmGqD7p4n6BjsLX_wbUoTvpyLKWWpOJOmCnFhE4zQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createBookingsTable() {
  try {
    console.log('예약 테이블 생성 시작...');
    
    // SQL 파일 읽기
    const sqlPath = path.join(__dirname, '..', 'database', 'create-bookings-table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // SQL 실행
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // rpc가 없다면 직접 실행
      console.log('RPC 방식 실패, 직접 실행 시도...');
      
      // SQL을 구문별로 분리하여 실행
      const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (const statement of statements) {
        const trimmedStatement = statement.trim();
        if (trimmedStatement) {
          console.log('실행 중:', trimmedStatement.substring(0, 50) + '...');
          
          try {
            const { error: stmtError } = await supabase.from('information_schema.tables').select('*').limit(1);
            // 이것은 단순히 연결 테스트입니다.
            
            // 실제로는 Supabase SQL Editor에서 수동으로 실행해야 합니다.
            console.log('Supabase SQL Editor에서 다음 SQL을 수동으로 실행해주세요:');
            console.log(sql);
            break;
          } catch (err) {
            console.error('구문 실행 오류:', err);
          }
        }
      }
    } else {
      console.log('예약 테이블 생성 완료:', data);
    }
    
  } catch (error) {
    console.error('예약 테이블 생성 중 오류:', error);
    console.log('\n수동으로 Supabase SQL Editor에서 다음 파일을 실행해주세요:');
    console.log('database/create-bookings-table.sql');
  }
}

createBookingsTable();
