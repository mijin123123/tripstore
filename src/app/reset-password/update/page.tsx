"use client";

import { useState, useEffect } from 'react';
import { Lock, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hashFromURL, setHashFromURL] = useState('');
  const router = useRouter();

  // URL에서 해시 파라미터 추출
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('현재 URL:', window.location.href);
      
      // URL 전체를 분석
      const url = new URL(window.location.href);
      console.log('URL 파라미터:', Object.fromEntries(url.searchParams.entries()));
      
      // URL 해시에서 액세스 토큰과 리프레시 토큰 추출
      const hash = window.location.hash.substring(1);
      setHashFromURL(hash);
      console.log('URL 해시 존재 여부:', hash ? '있음' : '없음');
      
      // Supabase 세션 가져오기 시도
      const getSession = async () => {
        try {
          // 현재 세션 확인
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('세션 가져오기 오류:', error);
            setError('인증 세션을 가져올 수 없습니다. 다시 시도해주세요.');
          } else if (data?.session) {
            console.log('현재 세션 정보:', data.session);
          } else {
            console.log('유효한 세션이 없습니다.');
            
            // 해시 파라미터가 있는 경우 처리 시도
            if (hash) {
              try {
                // URL 파라미터로부터 세션 복구 시도
                const hashParams = new URLSearchParams(hash);
                const type = hashParams.get('type');
                
                if (type === 'recovery') {
                  console.log('비밀번호 복구 파라미터 감지됨');
                  
                  // 토큰이 있으면 Supabase에 직접 전달
                  const { error: setSessionError } = await supabase.auth.setSession({
                    access_token: hashParams.get('access_token') || '',
                    refresh_token: hashParams.get('refresh_token') || ''
                  });
                  
                  if (setSessionError) {
                    console.error('세션 설정 오류:', setSessionError);
                    setError('비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.');
                  }
                }
              } catch (hashError) {
                console.error('해시 파라미터 처리 오류:', hashError);
              }
            }
          }
        } catch (err) {
          console.error('세션 처리 중 예외 발생:', err);
          setError('인증 처리 중 오류가 발생했습니다.');
        }
      };
      
      getSession();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      setError('비밀번호를 모두 입력해주세요.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('비밀번호 업데이트 시도');
      
      // 현재 세션 확인
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('현재 세션 상태:', sessionData?.session ? '세션 있음' : '세션 없음');
      
      // Supabase API를 사용하여 비밀번호 업데이트
      const { error: updateError, data } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) {
        console.error('비밀번호 업데이트 오류:', updateError);
        throw updateError;
      }
      
      console.log('비밀번호 업데이트 결과:', data);
      
      // 성공 메시지 표시
      setSuccess(true);
      console.log('비밀번호 업데이트 성공!');
      
      // 3초 후 로그인 페이지로 리디렉션
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      console.error('비밀번호 업데이트 오류:', err);
      
      // 오류 메시지 설정
      if (err.message?.includes('JWT')) {
        setError('인증 세션이 만료되었습니다. 비밀번호 재설정을 다시 요청해주세요.');
      } else {
        setError(err.message || '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image 
          src="https://images.unsplash.com/photo-1519055548599-6d4d129508c4?q=80&w=2070&auto=format&fit=crop"
          alt="여행 이미지"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-indigo-500/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">새 비밀번호 설정</h2>
            <p className="text-xl">새로운 비밀번호를 설정하여 계정을 보호하세요.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Update password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-white to-neutral-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3 text-neutral-800 tracking-tight">비밀번호 변경</h1>
            <p className="text-lg text-neutral-600">새로운 비밀번호를 입력해주세요.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="space-y-6 bg-white p-8 rounded-2xl shadow-md">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-green-800 mb-2">비밀번호가 변경되었습니다!</h3>
                <p className="text-green-700">
                  비밀번호가 성공적으로 변경되었습니다. 3초 후 로그인 페이지로 이동합니다.
                </p>
              </div>
              
              <div className="text-center pt-4">
                <Link 
                  href="/login" 
                  className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  로그인 페이지로 바로 가기
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-md">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700" htmlFor="password">
                  새 비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    id="password"
                    type="password"
                    placeholder="새 비밀번호 입력"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  비밀번호는 최소 6자 이상이어야 합니다.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700" htmlFor="confirmPassword">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    id="confirmPassword"
                    type="password"
                    placeholder="비밀번호 다시 입력"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
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
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      처리 중...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Check className="mr-2 h-5 w-5" />
                      비밀번호 변경하기
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
          
          <div className="text-center mt-6 text-neutral-500 text-sm">
            <Link href="/login" className="hover:text-blue-600 transition-colors">← 로그인 페이지로 돌아가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
