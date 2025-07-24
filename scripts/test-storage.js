const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Supabase 연결 설정
const SUPABASE_URL = 'https://ihhnvmzizaiokrfkatwt.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.wfwap5L5VIh4LUK7MS_Yrbq4ulS9APj2mkcJUufj8No'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testStorage() {
  try {
    console.log('Supabase Storage 연결 테스트를 시작합니다...')

    // 1. 버킷 목록 조회
    console.log('\n1. 버킷 목록 조회...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ 버킷 목록 조회 실패:', listError)
      return
    }

    console.log('✅ 사용 가능한 버킷:', buckets.map(b => b.name).join(', '))
    
    const imagesBucket = buckets.find(bucket => bucket.name === 'images')
    if (!imagesBucket) {
      console.error('❌ images 버킷이 없습니다. setup-storage.sql을 먼저 실행하세요.')
      return
    }

    console.log('✅ images 버킷 확인됨')

    // 2. 버킷 내 파일 목록 조회
    console.log('\n2. images 버킷 내 파일 목록 조회...')
    const { data: files, error: filesError } = await supabase.storage
      .from('images')
      .list('packages', {
        limit: 10,
        offset: 0
      })

    if (filesError) {
      console.log('⚠️ 파일 목록 조회 중 오류 (빈 폴더일 수 있음):', filesError.message)
    } else {
      console.log('✅ packages 폴더 내 파일 수:', files.length)
      if (files.length > 0) {
        console.log('파일 목록:', files.map(f => f.name).slice(0, 5).join(', '))
      }
    }

    // 3. 공개 URL 생성 테스트
    console.log('\n3. 공개 URL 생성 테스트...')
    const testPath = 'packages/test-image.jpg'
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(testPath)

    console.log('✅ 공개 URL 생성 가능:', urlData.publicUrl)

    // 4. 테스트 이미지 확인 (public/images 폴더에서)
    console.log('\n4. 로컬 테스트 이미지 확인...')
    const testImagePath = path.join(__dirname, '..', 'public', 'images', 'hotel-hero.jpg')
    
    if (fs.existsSync(testImagePath)) {
      console.log('✅ 테스트 이미지 발견:', testImagePath)
      
      const stats = fs.statSync(testImagePath)
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2)
      console.log(`파일 크기: ${fileSizeMB}MB`)
      
      if (stats.size <= 5 * 1024 * 1024) {
        console.log('✅ 파일 크기 제한 내 (5MB 이하)')
      } else {
        console.log('❌ 파일 크기가 너무 큼 (5MB 초과)')
      }
    } else {
      console.log('⚠️ 테스트 이미지 없음')
    }

    console.log('\n🎉 Storage 연결 테스트 완료!')
    console.log('')
    console.log('다음 단계:')
    console.log('1. Supabase 대시보드에서 database/setup-storage.sql 실행')
    console.log('2. 관리자 페이지에서 이미지 업로드 테스트')
    console.log('3. 업로드된 이미지가 제대로 표시되는지 확인')

  } catch (error) {
    console.error('❌ Storage 테스트 중 오류:', error)
  }
}

// 스크립트 실행
testStorage()
