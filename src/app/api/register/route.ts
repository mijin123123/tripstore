import { NextRequest, NextResponse } from 'next/server';
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

    const adminClient = createAdminClient();

    // Create user using admin client (automatically confirmed)
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: name,
      },
      email_confirm: true, // Skip email verification
    });

    if (error) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      if (error.message.includes('User already registered') || error.message.includes('already registered')) {
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

    // Insert user profile into profiles table
    const { error: profileError } = await adminClient
      .from('profiles')
      .insert([
        {
          id: data.user.id,
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
          id: data.user.id,
          email: data.user.email,
          name: name,
          confirmed: true,
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
