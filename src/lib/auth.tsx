"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// 사용자 타입 정의
type User = {
  id: string;
  email: string;
  name: string;
  created_at: string;
};

// Auth 컨텍스트 타입 정의
type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any | null; data: any | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  checkIsAdmin: () => Promise<boolean>;
};

// Auth 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth 컨텍스트 제공자 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 관리자 여부 확인 함수
  const checkIsAdmin = async () => {
    if (!user?.email) return false;
    
    // 하드코딩된 관리자 이메일 (개발용)
    const adminEmails = ['sonchanmin89@gmail.com'];
    
    if (adminEmails.includes(user.email)) {
      setIsAdmin(true);
      return true;
    }
    
    // TODO: 실제 관리자 테이블 확인 로직 추가
    setIsAdmin(false);
    return false;
  };

  useEffect(() => {
    // 초기 로딩 시 localStorage에서 사용자 정보 확인
    const checkStoredAuth = () => {
      try {
        const storedUser = localStorage.getItem('tripstore-user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // 관리자 권한 확인
          const adminEmails = ['sonchanmin89@gmail.com'];
          if (adminEmails.includes(userData.email)) {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('저장된 인증 정보 확인 중 오류:', error);
        localStorage.removeItem('tripstore-user');
      } finally {
        setLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  // 로그인 함수 (Neon DB API 사용)
  const signIn = async (email: string, password: string) => {
    try {
      console.log('로그인 시도:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || '로그인에 실패했습니다.') };
      }

      // 사용자 정보 저장
      const userData = data.user;
      setUser(userData);
      localStorage.setItem('tripstore-user', JSON.stringify(userData));

      // 관리자 권한 확인
      const adminEmails = ['sonchanmin89@gmail.com'];
      if (adminEmails.includes(userData.email)) {
        setIsAdmin(true);
      }

      console.log('로그인 성공:', userData);
      return { error: null };
    } catch (error: any) {
      console.error('로그인 중 오류:', error);
      return { error };
    }
  };

  // 회원가입 함수 (Neon DB API 사용)
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('회원가입 시도:', email);
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: new Error(data.error || '회원가입에 실패했습니다.'), data: null };
      }

      console.log('회원가입 성공:', data);
      return { error: null, data };
    } catch (error: any) {
      console.error('회원가입 중 오류:', error);
      return { error, data: null };
    }
  };

  // 로그아웃 함수
  const signOut = async () => {
    try {
      // 서버에서 쿠키 제거
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 클라이언트 상태 초기화
      setUser(null);
      setIsAdmin(false);
      localStorage.removeItem('tripstore-user');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAdmin,
      checkIsAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Auth 컨텍스트 사용 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
