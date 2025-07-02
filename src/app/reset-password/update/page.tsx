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
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  // 비밀번호 재설정 세션 처리 로직
  useEffect(() => {
    const initializeSession = async () => {
      try {
        console.log('비밀번호 재설정 페이지 초기화', { url: window.location.href });
        
        // 1. 현재 URL에서 토큰 정보 확인 (해시 및 쿼리 파라미터)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // 중요 정보 로깅
        console.log('URL 정보:', {
          hash: Object.fromEntries(hashParams.entries()),
          query: Object.fromEntries(queryParams.entries()),
        });
        
        // 2. 현재 세션 확인
        const { data: sessionData } = await supabase.auth.getSession();
        console.log('현재 세션:', sessionData?.session ? '있음' : '없음');
        
        // 3. 세션이 있으면 그대로 사용
        if (sessionData?.session) {
          console.log('기존 세션 사용');
          setSessionReady(true);
          return;
        }
        
        // 4. 개발 환경에서는 항상 활성화 (테스트 용이성)
        if (process.env.NODE_ENV === 'development') {
          console.log('개발 환경 - 세션 검증 생략');
          setSessionReady(true);
          return;
        }
        
        // 5. 쿼리에 type=recovery가 있으면 재설정 모드로 간주
        if (queryParams.get('type') === 'recovery') {
          console.log('recovery 쿼리 파라미터 감지됨');
          // 토큰을 직접 가져올 수 없지만, 이미 세션을 설정했다고 가정
          setSessionReady(true);
          return;
        }
        
        // 6. 해시에 access_token이 있는 경우
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          console.log('토큰 정보 발견, 세션 설정 시도');
          try {
            // Supabase v2에서는 setSession으로 세션을 설정
            const result = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            
            console.log('세션 설정 결과:', result.error ? '실패' : '성공');
            
            if (!result.error) {
              setSessionReady(true);
              return;
            }
          } catch (e) {
            console.error('세션 설정 중 오류:', e);
          }
        }
        
        // 7. 모든 시도 실패
        console.log('유효한 세션을 찾을 수 없음');
        setError('비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.');
        
        // 문제 해결을 위해 항상 활성화 (테스트용)
        setSessionReady(true);
      } catch (err) {
        console.error('초기화 중 오류:', err);
        setError('인증 상태를 초기화하는 중 오류가 발생했습니다.');
        
        // 문제 해결을 위해 항상 활성화 (테스트용)
        setSessionReady(true);
      }
    };
    
    initializeSession();
  }, []);

  // 비밀번호 변경 처리 (자세한 로깅 추가)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 검증
    if (password.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('비밀번호 변경 시도 시작');
      
      // 현재 세션 확인
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('비밀번호 변경 전 세션 상태:', sessionData?.session ? '세션 있음' : '세션 없음');
      
      // 비밀번호 업데이트 시도
      console.log('updateUser 함수 호출...');
      const { data, error: updateError } = await supabase.auth.updateUser({ password });
      
      // 결과 로깅
      console.log('updateUser 결과:', {
        성공: !updateError,
        데이터: data ? '있음' : '없음',
        에러: updateError ? updateError.message : '없음'
      });
      
      if (updateError) {
        console.error('비밀번호 변경 실패:', updateError);
        throw updateError;
      }
      
      console.log('비밀번호 변경 성공!');
      setSuccess(true);
      
      // 5초 후 로그인 페이지로 리디렉션
      console.log('5초 후 로그인 페이지로 이동합니다...');
      setTimeout(() => {
        router.push('/login');
      }, 5000);
    } catch (err: any) {
      console.error('비밀번호 변경 처리 중 예외 발생:', err);
      
      // Supabase 오류 상세 정보 확인
      if (err.status) {
        console.error('HTTP 상태 코드:', err.status);
      }
      
      setError(err.message || '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image 
          src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop"
          alt="보안 이미지"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-indigo-500/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">새 비밀번호 설정</h2>
            <p className="text-xl">안전한 비밀번호를 설정하여 계정을 보호하세요.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Reset password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-white to-neutral-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3 text-neutral-800 tracking-tight">비밀번호 재설정</h1>
            <p className="text-lg text-neutral-600">새로운 비밀번호를 입력해주세요.</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="mb-6 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="text-green-600 h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">비밀번호가 변경되었습니다!</h3>
              <p className="text-green-700 mb-4">
                비밀번호가 성공적으로 재설정되었습니다.
              </p>
              <p className="text-green-600 text-sm mb-4">
                5초 후 로그인 페이지로 이동합니다...
              </p>
              <Link 
                href="/login" 
                className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                로그인 페이지로 이동
              </Link>
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
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!sessionReady || loading}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">비밀번호는 최소 8자 이상이어야 합니다.</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700" htmlFor="confirm-password">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={!sessionReady || loading}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  type="submit"
                  disabled={!sessionReady || loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      처리 중...
                    </span>
                  ) : !sessionReady ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      인증 확인 중...
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
          
          <div className="text-center mt-6">
            <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
