import { UserPlus, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
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
          </div>
          <form className="space-y-6">
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
                />
              </div>
            </div>
            
            <div className="pt-4">
              <button
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                type="submit"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                가입하기
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
          </div>
        </div>
      </div>
    </div>
  );
}
