const { createClient } = require('@supabase/supabase-js')

// Supabase 연결 설정
const SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function setupStorage() {
  try {
    console.log('Storage 버킷 설정을 시작합니다...')

    // 1. 'images' 버킷이 존재하는지 확인
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('버킷 목록 조회 실패:', listError)
      return
    }

    const imagesBucket = buckets.find(bucket => bucket.name === 'images')
    
    if (!imagesBucket) {
      // 2. 'images' 버킷 생성
      console.log('images 버킷을 생성합니다...')
      const { error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (createError) {
        console.error('버킷 생성 실패:', createError)
        return
      }

      console.log('✅ images 버킷이 생성되었습니다.')
    } else {
      console.log('✅ images 버킷이 이미 존재합니다.')
    }

    // 3. 버킷 정책 설정 (공개 읽기 권한)
    console.log('버킷 정책을 설정합니다...')
    
    // RLS 정책 생성을 위한 SQL 실행
    const policies = [
      {
        name: 'Enable read access for all users',
        sql: `
          CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON storage.objects
          FOR SELECT USING (bucket_id = 'images');
        `
      },
      {
        name: 'Enable insert access for authenticated users only',
        sql: `
          CREATE POLICY IF NOT EXISTS "Enable insert access for authenticated users only" ON storage.objects
          FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
        `
      },
      {
        name: 'Enable update access for authenticated users only',
        sql: `
          CREATE POLICY IF NOT EXISTS "Enable update access for authenticated users only" ON storage.objects
          FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
        `
      },
      {
        name: 'Enable delete access for authenticated users only',
        sql: `
          CREATE POLICY IF NOT EXISTS "Enable delete access for authenticated users only" ON storage.objects
          FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
        `
      }
    ]

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec', { sql: policy.sql })
      if (error) {
        console.log(`정책 "${policy.name}" 설정 중 오류 (이미 존재할 수 있음):`, error.message)
      } else {
        console.log(`✅ 정책 "${policy.name}"이 설정되었습니다.`)
      }
    }

    console.log('🎉 Storage 설정이 완료되었습니다!')
    console.log('')
    console.log('이제 다음 기능들을 사용할 수 있습니다:')
    console.log('- 관리자는 이미지 업로드 가능')
    console.log('- 모든 사용자는 이미지 조회 가능')
    console.log('- 업로드된 이미지는 packages/ 폴더에 저장됩니다')

  } catch (error) {
    console.error('Storage 설정 중 오류:', error)
  }
}

// 스크립트 실행
setupStorage()
