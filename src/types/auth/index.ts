export interface UserInfo {
  uuid: string;
  name: string;
  email: string;
  gender: string;
  nickname: string;
  profileImageUrl: string;
  departmentName: string;
  studentNumber: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: UserInfo | null;
  login: (accessToken: string, user: UserInfo) => void;
  logout: () => void;
  setUser: (user: UserInfo) => void;
}
