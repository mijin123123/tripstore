"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 임시 사용자 데이터 (실제 구현에서는 서버에서 가져와야 함)
const tempUsers: User[] = [
  { id: 'user1', email: 'test1@example.com', fullName: '김철수' },
  { id: 'user2', email: 'test2@example.com', fullName: '이영희' },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 저장된 사용자 정보 확인
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // 임시 로그인 로직 - 실제로는 서버 API 호출
    const foundUser = tempUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 서버 사이드에서 사용할 수 있는 사용자 정보 가져오기 함수
export async function getCurrentUser(): Promise<{ id: string; email: string; fullName: string } | null> {
  // 실제 구현에서는 쿠키나 세션에서 사용자 정보를 가져와야 함
  // 지금은 임시로 첫 번째 사용자를 반환
  return { id: 'user1', email: 'test1@example.com', fullName: '김철수' };
}
