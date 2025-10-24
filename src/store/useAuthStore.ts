import { create } from 'zustand';
import type { UserInfo } from '@/types/auth';

interface AuthState {
  isLoggedIn: boolean;
  user: UserInfo | null;
  setLoggedIn: (v: boolean) => void;
  setUser: (u: UserInfo | null) => void;
  resetUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  setLoggedIn: (v) => set({ isLoggedIn: v }),
  setUser: (u) => set({ user: u }),
  resetUser: () => set({ isLoggedIn: false, user: null }),
}));
