import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, UserInfo } from '../types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
      login: (accessToken, user) => {
        set({ isLoggedIn: true, accessToken, user });
      },
      logout: () => {
        set({ isLoggedIn: false, accessToken: null, user: null });
      },
      setUser: (user: UserInfo) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
