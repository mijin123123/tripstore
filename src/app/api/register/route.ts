import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Sign up user without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: undefined, // No email verification
      },
    });

    if (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        return NextResponse.json(
          { error: '이미 가입된 이메일 주소입니다.' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: '회원가입 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: '회원가입에 실패했습니다.' },
        { status: 500 }
      );
    }

    // If user is created but not confirmed, we need to confirm them manually
    // This is a workaround for Supabase's email confirmation requirement
    let finalUser = data.user;
    
    if (!data.user.email_confirmed_at) {
      // Try to confirm the user using admin client
      const adminClient = createAdminClient();
      const { data: confirmData, error: confirmError } = await adminClient.auth.admin.updateUserById(
        data.user.id,
        { email_confirm: true }
      );
      
      if (confirmError) {
        console.error('User confirmation error:', confirmError);
        // Continue anyway, user is created but may need to be manually confirmed
      } else if (confirmData.user) {
        finalUser = confirmData.user;
      }
    }

    // Insert user profile into profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: finalUser.id,
          name: name,
          email: email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't return error here as user is already created
    }

    return NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다. 로그인해주세요.',
        user: {
          id: finalUser.id,
          email: finalUser.email,
          name: name,
          confirmed: !!finalUser.email_confirmed_at,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
