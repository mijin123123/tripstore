// Supabase Storage에서 hero-images 버킷을 생성하는 스크립트
import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = 'https://ihhnvmzizaiokrfkatwt.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // 서비스 역할 키 필요

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY 환경 변수가 필요합니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createHeroImagesBucket() {
  try {
    console.log('hero-images 버킷 생성 시작...')
    
    // 기존 버킷 확인
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      throw listError
    }
    
    const existingBucket = buckets.find(bucket => bucket.id === 'hero-images')
    
    if (existingBucket) {
      console.log('hero-images 버킷이 이미 존재합니다.')
      return
    }
    
    // 버킷 생성
    const { data, error } = await supabase.storage.createBucket('hero-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (error) {
      throw error
    }
    
    console.log('hero-images 버킷이 성공적으로 생성되었습니다:', data)
    
    // 버킷 정책 설정 (RLS 정책은 SQL로 실행해야 함)
    console.log('\n다음 SQL을 Supabase SQL Editor에서 실행해주세요:')
    console.log(`
-- RLS 정책 설정
CREATE POLICY "Public Access for hero-images" ON storage.objects 
FOR SELECT USING (bucket_id = 'hero-images');

CREATE POLICY "Admin can upload hero images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin can update hero images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Admin can delete hero images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'hero-images' 
  AND auth.role() = 'authenticated'
);
    `)
    
  } catch (error) {
    console.error('버킷 생성 중 오류 발생:', error)
  }
}

// 스크립트 실행
createHeroImagesBucket()
