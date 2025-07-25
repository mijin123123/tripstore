'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { Session, User } from '@supabase/supabase-js'

// 인증 컨텍스트 타입 정의
type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  refreshSession: () => Promise<void>
  signOut: () => Promise<{ success: boolean, error?: unknown }>
  isAdmin: boolean
  // 디버그용 함수 추가
  setAdminForDebug: (isAdmin: boolean) => void
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined)

  // 인증 제공자 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // 디버그용 관리자 설정 함수
  const setAdminForDebug = (adminState: boolean) => {
    console.log('관리자 상태 디버그 설정:', adminState);
    setIsAdmin(adminState);
  }
  
  // 개발 중 상태 디버깅 (간소화)
  useEffect(() => {
    // 로깅을 최소화하여 무한 로깅 방지
    if (user) {
      console.log('인증 상태:', { 
        email: user.email,
        isAdmin: isAdmin 
      });
    }
  }, [user?.id, isAdmin]); // user.id로 변경하여 불필요한 리렌더링 방지  // 세션 가져오기 함수
  const refreshSession = async () => {
    try {
      setLoading(true);
      console.log('세션 갱신 시작');
      
      const supabase = createClient();
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('세션 가져오기 실패:', error);
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        return;
      }
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        console.log('세션 갱신 성공:', data.session.user.email);
        
        // 간단한 관리자 권한 확인
        const userRole = data.session.user.app_metadata?.role || 
                        data.session.user.user_metadata?.role;
        
        if (userRole === 'admin') {
          console.log('관리자 권한 확인됨');
          setIsAdmin(true);
        } else {
          console.log('일반 사용자');
          setIsAdmin(false);
        }
      } else {
        console.log('세션 없음');
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('세션 갱신 오류:', error);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const signOut = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('로그아웃 오류:', error);
        throw error;
      }
      
      // 세션 초기화
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      // 로컬 스토리지에서 수파베이스 인증 데이터 제거
      Object.keys(localStorage).forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      
      console.log('로그아웃 성공');
      return { success: true };
    } catch (error) {
      console.error('로그아웃 중 예외 발생:', error);
      return { success: false, error };
    }
  };

  // 초기 로딩 및 인증 이벤트 구독
  useEffect(() => {
    let isActive = true;
    const supabase = createClient();
    
    // 초기 세션 가져오기 (컴포넌트 마운트 시)
    refreshSession();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, currentSession: Session | null) => {
      console.log('Auth 이벤트:', event); // 단순한 이벤트 로그만 남김
      
      if (!isActive) return;
      
      // 세션이 동일하면 중복 처리 방지
      if (event === 'SIGNED_IN' && session?.user?.id === currentSession?.user?.id) {
        console.log('동일한 세션 - 중복 처리 방지');
        return;
      }
      
      if (event === 'SIGNED_IN' && currentSession) {
        console.log('새 로그인 감지:', currentSession.user?.email);
        setSession(currentSession);
        setUser(currentSession.user);
        
        // 관리자 권한 확인 (간단하게)
        const userRole = currentSession.user.app_metadata?.role || 
                        currentSession.user.user_metadata?.role;
        
        if (userRole === 'admin') {
          console.log('메타데이터에서 관리자 확인');
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('로그아웃 감지');
        setSession(null);
        setUser(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
      isActive = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      refreshSession, 
      signOut, 
      isAdmin,
      setAdminForDebug 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// 훅 사용
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다')
  }
  return context
}
