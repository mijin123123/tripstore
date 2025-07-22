const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gzjrwyzcufrwvpbmrifg.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function createResortsTable() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('리조트 테이블 생성 중...');
    
    // RLS 정책 해제 (서비스 롤)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const adminClient = serviceKey ? createClient(supabaseUrl, serviceKey) : null;
    
    if (!adminClient) {
      console.warn('서비스 롤 키가 없어서 RLS를 우회할 수 없습니다. 테이블 생성만 진행합니다.');
    }
    
    const client = adminClient || supabase;

    // 리조트 테이블 생성
    const { error: createError } = await client.rpc('create_resorts_table', {});
    
    if (createError) {
      console.log('RPC를 통한 테이블 생성 시도 실패. SQL 쿼리로 시도합니다.');
      
      // SQL 쿼리로 직접 테이블 생성
      const { error } = await client.rpc('create_table', {
        table_sql: `
          CREATE TABLE IF NOT EXISTS public.resorts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            image TEXT NOT NULL,
            rating DECIMAL(3,1) DEFAULT 4.5,
            price TEXT NOT NULL,
            amenities TEXT[] DEFAULT '{}',
            region_id INTEGER REFERENCES public.regions(id),
            description TEXT,
            max_people INTEGER,
            has_beach_access BOOLEAN DEFAULT false,
            has_pool BOOLEAN DEFAULT false,
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
          );
          
          ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
          
          CREATE POLICY "누구나 리조트를 볼 수 있음" ON public.resorts
            FOR SELECT USING (true);
          
          CREATE POLICY "인증된 사용자만 리조트를 추가할 수 있음" ON public.resorts
            FOR INSERT WITH CHECK (auth.role() = 'authenticated');
          
          CREATE POLICY "인증된 사용자만 리조트를 수정할 수 있음" ON public.resorts
            FOR UPDATE USING (auth.role() = 'authenticated');
          
          CREATE POLICY "인증된 사용자만 리조트를 삭제할 수 있음" ON public.resorts
            FOR DELETE USING (auth.role() = 'authenticated');
        `
      });
      
      if (error) {
        console.error('SQL 쿼리 실행 중 오류:', error);
        
        // 마지막 시도: SQL 쿼리를 분리해서 실행
        try {
          console.log('분리된 쿼리로 테이블 생성 시도...');
          
          // 테이블 생성
          await client.from('_database_migrations').insert({
            name: 'create_resorts_table',
            sql: `
              CREATE TABLE IF NOT EXISTS public.resorts (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name TEXT NOT NULL,
                location TEXT NOT NULL,
                image TEXT NOT NULL,
                rating DECIMAL(3,1) DEFAULT 4.5,
                price TEXT NOT NULL,
                amenities TEXT[] DEFAULT '{}',
                region_id INTEGER REFERENCES public.regions(id),
                description TEXT,
                max_people INTEGER,
                has_beach_access BOOLEAN DEFAULT false,
                has_pool BOOLEAN DEFAULT false,
                is_featured BOOLEAN DEFAULT false,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
              );
            `
          });
          
          console.log('테이블이 생성되었습니다.');
          
          // RLS 정책 생성
          await client.from('_database_migrations').insert({
            name: 'create_resorts_rls_policies',
            sql: `
              ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;
              
              CREATE POLICY "누구나 리조트를 볼 수 있음" ON public.resorts
                FOR SELECT USING (true);
              
              CREATE POLICY "인증된 사용자만 리조트를 추가할 수 있음" ON public.resorts
                FOR INSERT WITH CHECK (auth.role() = 'authenticated');
              
              CREATE POLICY "인증된 사용자만 리조트를 수정할 수 있음" ON public.resorts
                FOR UPDATE USING (auth.role() = 'authenticated');
              
              CREATE POLICY "인증된 사용자만 리조트를 삭제할 수 있음" ON public.resorts
                FOR DELETE USING (auth.role() = 'authenticated');
            `
          });
          
          console.log('RLS 정책이 생성되었습니다.');
        } catch (separatedError) {
          console.error('분리된 쿼리 실행 중 오류:', separatedError);
          
          console.log('Supabase 대시보드에서 직접 테이블을 생성해주세요.');
          console.log('SQL 스크립트:');
          console.log(`
CREATE TABLE IF NOT EXISTS public.resorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  image TEXT NOT NULL,
  rating DECIMAL(3,1) DEFAULT 4.5,
  price TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  region_id INTEGER REFERENCES public.regions(id),
  description TEXT,
  max_people INTEGER,
  has_beach_access BOOLEAN DEFAULT false,
  has_pool BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.resorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "누구나 리조트를 볼 수 있음" ON public.resorts
  FOR SELECT USING (true);

CREATE POLICY "인증된 사용자만 리조트를 추가할 수 있음" ON public.resorts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 리조트를 수정할 수 있음" ON public.resorts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "인증된 사용자만 리조트를 삭제할 수 있음" ON public.resorts
  FOR DELETE USING (auth.role() = 'authenticated');
          `);
          return;
        }
      } else {
        console.log('테이블이 성공적으로 생성되었습니다!');
      }
    } else {
      console.log('리조트 테이블이 성공적으로 생성되었습니다!');
    }
    
    // 테이블 생성 확인
    const { data, error: checkError } = await supabase
      .from('resorts')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.log('테이블 확인 중 오류:', checkError);
    } else {
      console.log('리조트 테이블이 확인되었습니다:', data);
    }
  } catch (error) {
    console.error('테이블 생성 중 예상치 못한 오류가 발생했습니다:', error);
  }
}

createResortsTable();
