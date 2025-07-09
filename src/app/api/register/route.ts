import { NextRequest, NextResponse } from 'next/server';
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  console.log('=== 회원가입 API 시작 ===');
  
  try {
    console.log('📥 요청 본문 파싱 시도...');
    const { name, email, password } = await request.json();
    console.log('✅ 요청 데이터:', { name, email, password: '***' });

    // 입력 데이터 검증
    if (!name || !email || !password) {
      console.log('❌ 필수 필드 누락');
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ 이메일 형식 오류:', email);
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      console.log('❌ 비밀번호 길이 부족:', password.length);
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    // 환경 변수 확인
    console.log('🔍 환경 변수 확인 중...');
    if (!process.env.NEON_DATABASE_URL) {
      console.error('❌ NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.');
      return NextResponse.json(
        { error: '데이터베이스 연결 설정이 없습니다.' },
        { status: 500 }
      );
    }
    console.log('✅ NEON_DATABASE_URL 존재:', process.env.NEON_DATABASE_URL?.substring(0, 20) + '...');

    console.log('🔗 데이터베이스 연결 시도...');
    const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL });
    console.log('✅ Pool 생성 완료');
    
    console.log('📝 users 테이블 컬럼 추가 시도...');
    // users 테이블이 없다면 생성하고, 필요한 컬럼들을 추가
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      )
    `);
    
    // password_hash 컬럼이 없다면 추가
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
    `);
    console.log('✅ users 테이블 설정 완료');

    console.log('🔍 기존 사용자 확인 중...');
    // 이미 존재하는 이메일인지 확인
    const existingUser = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );
    console.log('✅ 기존 사용자 확인 완료. 중복 수:', existingUser.rows.length);

    if (existingUser.rows.length > 0) {
      console.log('❌ 이메일 중복:', email);
      return NextResponse.json(
        { error: '이미 가입된 이메일 주소입니다.' },
        { status: 409 }
      );
    }

    console.log('🔐 비밀번호 해시화 시작...');
    // 비밀번호 해시화
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    console.log('✅ 비밀번호 해시화 완료. Hash 길이:', passwordHash.length);

    console.log('💾 사용자 등록 시도...');
    // 사용자 등록 (full_name 컬럼 사용)
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, updated_at) 
       VALUES ($1, $2, $3, now()) 
       RETURNING id, full_name, email, created_at`,
      [name, email, passwordHash]
    );
    console.log('✅ 사용자 등록 완료. 결과 행 수:', result.rows.length);

    const newUser = result.rows[0];
    console.log('✅ 새 사용자 데이터:', { id: newUser.id, email: newUser.email });

    console.log('✅ 새 사용자 데이터:', { id: newUser.id, email: newUser.email });

    console.log('📤 응답 준비 중...');
    const response = NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다. 로그인해주세요.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.full_name,
          created_at: newUser.created_at,
        }
      },
      { status: 201 }
    );
    console.log('✅ 회원가입 성공 응답 반환');
    return response;

  } catch (error: any) {
    console.error('💥 회원가입 중 오류 발생:');
    console.error('에러 타입:', typeof error);
    console.error('에러 이름:', error?.name);
    console.error('에러 메시지:', error?.message);
    console.error('에러 코드:', error?.code);
    console.error('에러 스택:', error?.stack);
    console.error('전체 에러 객체:', error);
    
    // PostgreSQL 에러 코드 처리
    if (error.code === '23505') { // unique constraint violation
      console.log('❌ PostgreSQL 중복 제약 조건 위반');
      return NextResponse.json(
        { error: '이미 가입된 이메일 주소입니다.' },
        { status: 409 }
      );
    }
    
    console.log('❌ 일반적인 서버 오류 응답 반환');
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
