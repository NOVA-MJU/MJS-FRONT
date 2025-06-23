import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  login: (token: string) => {
    set(() => ({ isLoggedin: true, accessToken: token }));
  },
  logout: () => {
    set(() => ({ isLoggedin: false, accessToken: null }));
  },
}));
