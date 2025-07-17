import { create } from 'zustand';

interface UserInfo {
  uuid: string;
  name: string;
  email: string;
  gender: string;
  nickname: string;
  department: string;
  studentNumber: string;
}

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: UserInfo | null;
  login: (accessToken: string, user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'), // 새로고침 시 유지
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  login: (accessToken, user) => {
    localStorage.setItem('accessToken', accessToken);
    set({ isLoggedIn: true, accessToken, user });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ isLoggedIn: false, accessToken: null, user: null });
  },
}));
