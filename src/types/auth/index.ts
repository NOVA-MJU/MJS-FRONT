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

  user: UserInfo | null;
  login: (user: UserInfo) => void;
  logout: () => void;
  setUser: (user: UserInfo) => void;
}
