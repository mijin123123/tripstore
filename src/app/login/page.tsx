import { LogIn, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="여행 이미지"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-indigo-500/50 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-white max-w-lg">
            <h2 className="text-4xl font-bold mb-6">새로운 모험이 여러분을 기다립니다</h2>
            <p className="text-xl">로그인하고 잊지 못할 여행을 계획해보세요. TripStore와 함께라면 언제 어디서든 특별한 경험이 가능합니다.</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-white to-neutral-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold mb-3 text-neutral-800 tracking-tight">로그인</h1>
            <p className="text-lg text-neutral-600">TripStore에 오신 것을 환영합니다.</p>
          </div>
          <form className="space-y-6 bg-white p-8 rounded-2xl shadow-md">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-neutral-700" htmlFor="email">
                이메일 주소
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                <input
                  className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
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
                  className="pl-12 block w-full px-4 py-3.5 text-neutral-900 border border-neutral-300 rounded-xl shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-neutral-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-neutral-700">로그인 정보 저장</label>
              </div>
              <div className="text-sm">
                <Link href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
            
            <div className="pt-4">
              <button
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                type="submit"
              >
                <LogIn className="mr-2 h-5 w-5" />
                로그인
              </button>
            </div>
          </form>
          
          <div className="mt-10 pt-6 border-t border-neutral-200">
            <p className="text-center text-neutral-600">
              아직 회원이 아니신가요?{' '}
              <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                회원가입 하러 가기
              </Link>
            </p>
          </div>
          
          <div className="text-center mt-6 text-neutral-500 text-sm">
            <Link href="/" className="hover:text-blue-600 transition-colors">← 홈으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
