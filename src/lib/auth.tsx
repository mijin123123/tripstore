"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

// 관리자 사용자 타입 정의 (간소화)
type User = {
  id?: string;
  email?: string;
  role?: string;
};

// Auth 컨텍스트 타입 정의 (간소화)
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
};

// Auth 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth 컨텍스트 제공자 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 쿠키 기반 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // 간단한 클라이언트 측 확인 (실제로는 서버에서 검증이 필요할 수 있음)
        const adminCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('admin_auth='));
        
        if (adminCookie) {
          // 관리자로 인증된 상태
          setIsAdmin(true);
          setUser({ 
            email: 'sonchanmin89@gmail.com', // 하드코딩된 값
            role: 'admin'
          });
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('인증 상태 확인 중 오류:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || '로그인에 실패했습니다.' };
      }

      // 로그인 성공 후 쿠키가 설정됨 (API에서 처리)
      setIsAdmin(true);
      setUser({ 
        email, 
        role: 'admin'
      });
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || '로그인 중 오류가 발생했습니다.' };
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    setIsLoading(true);
    try {
      // 쿠키 삭제를 위해 서버 API 호출
      document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
      setIsAdmin(false);
      window.location.href = '/admin/login'; // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Auth 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
