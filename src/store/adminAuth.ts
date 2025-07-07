import { create } from 'zustand';

interface AdminAuthStore {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAdminAuthStore = create<AdminAuthStore>((set) => ({
  isAuthenticated: false,
  login: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      set({ isAuthenticated: true });
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('isAdminAuthenticated');
      set({ isAuthenticated: false });
    }
  },
  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const isAuthenticated = sessionStorage.getItem('isAdminAuthenticated') === 'true';
      set({ isAuthenticated });
    }
  },
}));

export default useAdminAuthStore;
