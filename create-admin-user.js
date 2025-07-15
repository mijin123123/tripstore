require('dotenv').config();
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service Role Key 필요

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
  try {
    console.log('🔄 관리자 계정 생성 중...');
    
    const email = 'sonchanmin89@gmail.com';
    const password = 'aszx1212';
    const name = '관리자';
    const role = 'admin';
    
    // 비밀번호 해시화
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // 기존 사용자 확인
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      console.log('⚠️  이미 존재하는 사용자입니다:', existingUser);
      
      // 기존 사용자를 관리자로 업데이트
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ 
          role: role,
          password_hash: passwordHash,
          name: name,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ 사용자 업데이트 실패:', updateError);
        return;
      }
      
      console.log('✅ 기존 사용자를 관리자로 업데이트했습니다:', {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      });
      return;
    }
    
    // 새 관리자 사용자 생성
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: email,
        password_hash: passwordHash,
        name: name,
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ 관리자 계정 생성 실패:', insertError);
      return;
    }
    
    console.log('✅ 관리자 계정이 성공적으로 생성되었습니다:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });
    
  } catch (error) {
    console.error('❌ 오류 발생:', error);
  }
}

// 스크립트 실행
createAdminUser();
