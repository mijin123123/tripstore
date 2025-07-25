// Storage 업로드 테스트 스크립트
// 브라우저 콘솔에서 실행하여 Storage 권한을 테스트해보세요

async function testStorageUpload() {
  try {
    // Supabase 클라이언트 가져오기
    const { createClient } = await import('./src/lib/supabase');
    const supabase = createClient();
    
    console.log('1. 현재 사용자 확인...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('❌ 사용자 인증 실패:', userError);
      return;
    }
    
    console.log('✅ 현재 사용자:', user.email);
    
    console.log('2. Storage 버킷 정보 확인...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ 버킷 조회 실패:', bucketsError);
      return;
    }
    
    console.log('✅ 사용 가능한 버킷들:', buckets.map(b => b.name));
    
    const imagesBucket = buckets.find(b => b.id === 'images');
    if (!imagesBucket) {
      console.error('❌ images 버킷을 찾을 수 없습니다');
      return;
    }
    
    console.log('✅ images 버킷 정보:', imagesBucket);
    
    console.log('3. 테스트 파일 업로드 시도...');
    
    // 작은 테스트 파일 생성
    const testContent = 'test file content';
    const testFile = new Blob([testContent], { type: 'text/plain' });
    const testFileName = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(`test/${testFileName}`, testFile, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (uploadError) {
      console.error('❌ 업로드 실패:', uploadError);
      console.error('상세 오류:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError
      });
      return;
    }
    
    console.log('✅ 업로드 성공:', uploadData);
    
    console.log('4. 업로드된 파일 URL 확인...');
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(`test/${testFileName}`);
    
    console.log('✅ 공개 URL:', publicUrl);
    
    console.log('5. 업로드된 파일 삭제...');
    const { error: deleteError } = await supabase.storage
      .from('images')
      .remove([`test/${testFileName}`]);
    
    if (deleteError) {
      console.error('❌ 삭제 실패:', deleteError);
    } else {
      console.log('✅ 삭제 완료');
    }
    
    console.log('🎉 Storage 업로드 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류:', error);
  }
}

// 테스트 실행
testStorageUpload();
