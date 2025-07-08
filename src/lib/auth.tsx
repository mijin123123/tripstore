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
      console.log('로그아웃 API 호출 중...');
      
      // 로그아웃 API 호출 (HttpOnly 쿠키를 서버에서 삭제하기 위함)
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 필요한 경우 CSRF 토큰이나 기타 데이터를 포함
        body: JSON.stringify({ 
          timestamp: new Date().toISOString() 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '로그아웃 처리 중 오류가 발생했습니다');
      }
      
      console.log('로그아웃 API 응답:', response.status);
      
      // 클라이언트 측 상태 초기화
      setUser(null);
      setIsAdmin(false);
      
      // 추가로 클라이언트 측 쿠키도 삭제 (이중 안전장치)
      document.cookie = 'admin_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      console.log('로그아웃 성공, 로그인 페이지로 리다이렉트');
      
      // 페이지를 완전히 새로고침하면서 로그인 페이지로 이동
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      alert('로그아웃 처리 중 오류가 발생했습니다.');
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
  
  // 빌드 시 오류 방지: 서버 렌더링 중이거나 컨텍스트가 없으면 기본값 반환
  if (typeof window === 'undefined' || context === undefined) {
    // 서버 렌더링 중이거나 AuthProvider 외부에서 호출될 때 기본값 반환
    return {
      user: null,
      isLoading: false,
      isAdmin: false,
      login: async () => ({ error: '로그인 기능을 사용할 수 없습니다.' }),
      logout: async () => { console.log('로그아웃 시도'); }
    };
  }
  
  return context;
}
