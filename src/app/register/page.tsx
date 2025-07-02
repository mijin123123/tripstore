'use client';

import { UserPlus, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envInfo, setEnvInfo] = useState<string>('환경변수 확인 중...');
  const router = useRouter();
  const supabase = createClient();
  
  useEffect(() => {
    // 환경 변수 확인 (URL의 일부만 표시하여 보안 유지)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '설정 안됨';
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    setEnvInfo(`Supabase URL: ${supabaseUrl.substring(0, 15)}... / API Key 설정됨: ${hasAnonKey ? '예' : '아니오'}`);
    
    console.log('Supabase 환경설정:', {
      url: supabaseUrl,
      hasKey: hasAnonKey
    });
  }, []);

  // 관리자 계정 자동 생성 함수 (개발 환경에서만 사용)
  const createAdminAccount = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 이메일과 비밀번호 설정
      const adminEmail = 'sonchanmin89@gmail.com';
      const adminPassword = 'Admin123!@#'; // 안전한 비밀번호 사용
      
      console.log('관리자 계정 생성 시도:', adminEmail);
      
      // Supabase Auth로 회원가입
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            name: '시스템 관리자'
          }
        }
      });
      
      console.log('관리자 계정 생성 응답:', { data, error: signUpError });

      if (signUpError) throw signUpError;
      
      alert(`관리자 계정(${adminEmail})이 생성되었습니다. 이메일 인증을 확인해주세요.`);
    } catch (err: any) {
      console.error('관리자 계정 생성 오류:', err);
      setError(err.message || '관리자 계정 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('회원가입 시도:', { name, email });

    // 입력 검증
    if (!name || !email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Supabase signUp 호출 전');
      
      // Supabase Auth로 회원가입
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      console.log('Supabase signUp 응답:', { data, error: signUpError });

      if (signUpError) throw signUpError;
      
      alert('회원가입이 완료되었습니다. 이메일 인증을 확인해주세요.');
      console.log('회원가입 성공, 데이터:', data);
      router.push('/login');
    } catch (err: any) {
      console.error('회원가입 오류:', err);
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image 
          src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"
          alt="여행 이미지"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/60 to-blue-500/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">여행의 시작, TripStore와 함께</h2>
            <p className="text-xl">무료 회원가입으로 여행 정보를 저장하고, 특별 할인 혜택을 누리며, 완벽한 여행을 계획해보세요.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Register form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3 text-neutral-800">회원가입</h1>
            <p className="text-lg text-neutral-600">TripStore와 함께 특별한 여행을 시작하세요.</p>
            <p className="text-xs text-neutral-400 mt-2">{envInfo}</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700" htmlFor="name">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700" htmlFor="email">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700" htmlFor="password">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700" htmlFor="confirm-password">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></span>
                ) : (
                  <UserPlus className="mr-2 h-5 w-5" />
                )}
                {loading ? '처리 중...' : '가입하기'}
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <p className="text-center text-neutral-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                로그인 하러 가기
              </Link>
            </p>
            
            {/* 개발 환경에서만 표시 (나중에 process.env.NODE_ENV === 'development'로 체크) */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-500 mb-2">🛠️ 개발 도구</p>
              <button
                onClick={createAdminAccount}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded transition-colors"
                type="button"
                disabled={loading}
              >
                관리자 계정 자동 생성
              </button>
              <p className="text-xs text-gray-400 mt-2">
                ℹ️ sonchanmin89@gmail.com 계정을 자동으로 생성합니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
