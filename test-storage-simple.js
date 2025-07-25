const { createClient } = require('@supabase/supabase-js')

// 하드코딩된 값 사용
const supabaseUrl = 'https://ihhnvmzizaiokrfkatwt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloaG52bXppemFpb2tyZmthdHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODg1OTksImV4cCI6MjA2ODY2NDU5OX0.wfwap5L5VIh4LUK7MS_Yrbq4ulS9APj2mkcJUufj8No'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStorageSetup() {
  try {
    console.log('🔍 Storage 설정 확인 중...')
    
    // 1. 버킷 조회
    console.log('\n1. 버킷 정보 확인:')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ 버킷 조회 실패:', bucketsError)
      return
    }
    
    console.log('✅ 사용 가능한 버킷들:')
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.id}: ${bucket.name} (public: ${bucket.public})`)
    })
    
    // 2. images 버킷 확인
    const imagesBucket = buckets.find(b => b.id === 'images')
    if (!imagesBucket) {
      console.log('\n❌ images 버킷이 없습니다. 생성이 필요합니다.')
      return
    }
    
    console.log('\n✅ images 버킷 세부 정보:')
    console.log(`  - ID: ${imagesBucket.id}`)
    console.log(`  - 이름: ${imagesBucket.name}`)
    console.log(`  - 공개: ${imagesBucket.public}`)
    console.log(`  - 파일 크기 제한: ${imagesBucket.file_size_limit} bytes`)
    console.log(`  - 허용된 MIME 타입: ${imagesBucket.allowed_mime_types}`)
    
    // 3. 테스트 업로드
    console.log('\n2. 테스트 업로드 시도:')
    const testContent = 'test storage upload'
    const testFile = Buffer.from(testContent)
    const testFileName = `test-${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`test/${testFileName}`, testFile, {
        contentType: 'text/plain',
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('❌ 테스트 업로드 실패:', uploadError)
      console.error('상세 오류 정보:')
      console.error(`  - 메시지: ${uploadError.message}`)
      console.error(`  - 상태 코드: ${uploadError.statusCode}`)
      return
    }
    
    console.log('✅ 테스트 업로드 성공:', uploadData.path)
    
    // 4. 공개 URL 확인
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`test/${testFileName}`)
    
    console.log('✅ 공개 URL:', publicUrl)
    
    // 5. 파일 삭제
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([`test/${testFileName}`])
    
    if (deleteError) {
      console.error('❌ 파일 삭제 실패:', deleteError)
    } else {
      console.log('✅ 테스트 파일 삭제 완료')
    }
    
    console.log('\n🎉 Storage 설정이 정상적으로 작동합니다!')
    
  } catch (error) {
    console.error('❌ 오류 발생:', error)
  }
}

checkStorageSetup()
