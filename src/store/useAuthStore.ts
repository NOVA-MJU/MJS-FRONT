import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, UserInfo } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (user) => {
        set({ isLoggedIn: true, user });
      },
      logout: () => {
        try {
          sessionStorage.clear();
        } catch (e) {
          // 브라우저 환경 아닐 때 예외처리
          console.warn('sessionStorage clear failed:', e);
        }
        set({ isLoggedIn: false, user: null });
      },
      setUser: (user: UserInfo) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
      }),
    },
  ),
);
