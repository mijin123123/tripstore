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
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth State Change: ${event}`);
      if (event === "PASSWORD_RECOVERY") {
        console.log("Password recovery event detected. Session is now valid.");
        setSessionReady(true);
        setLoading(false);
        setError(null);
      }
    });

    // 페이지 로드 시 현재 세션 확인
    supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
            console.log("An active session was found on mount.");
            setSessionReady(true);
            setLoading(false);
        } else {
            // 지연 후에도 세션이 없으면 링크가 유효하지 않은 것으로 간주
            setTimeout(() => {
                // onAuthStateChange가 실행되었을 수 있으므로 다시 확인
                if (!sessionReady) { 
                    console.error("No session established. The recovery link may be invalid or expired.");
                    setError("비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다. 새로운 재설정 링크를 요청해주세요.");
                    setLoading(false);
                }
            }, 3000); // 3초 대기
        }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // 마운트 시 한 번만 실행

  // 비밀번호 변경 처리 (자세한 로깅 추가)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionReady) {
      setError("세션이 유효하지 않습니다. 페이지를 새로고침하거나 다시 시도해주세요.");
      return;
    }
    
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
            <div className="text-center p-8 bg-green-50 border border-green-200 rounded-2xl shadow-md">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">비밀번호 변경 완료</h3>
              <p className="text-green-700 mb-6">비밀번호가 성공적으로 변경되었습니다. 이제 새 비밀번호로 로그인할 수 있습니다.</p>
              <Link href="/login" className="inline-flex items-center justify-center w-full py-3 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="mr-2 h-5 w-5" />
                로그인 페이지로 이동
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-md">
              <fieldset disabled={!sessionReady || loading}>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700" htmlFor="password">
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-neutral-100"
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-neutral-500">비밀번호는 최소 8자 이상이어야 합니다.</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700" htmlFor="confirm-password">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                    <input
                      className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-neutral-100"
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                    type="submit"
                    disabled={loading || !sessionReady}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        처리 중...
                      </span>
                    ) : '비밀번호 변경하기'}
                  </button>
                </div>
              </fieldset>
            </form>
          )}
          
          {!success && (
            <div className="text-center mt-6">
              <Link href="/login" className="text-sm text-blue-600 hover:underline">
                <ArrowLeft className="inline-block mr-1 h-4 w-4" />
                로그인 페이지로 돌아가기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
