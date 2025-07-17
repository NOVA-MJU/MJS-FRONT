/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface RegisterReq {
  name: string;
  email: string;
  password: string;
  gender: string;
  nickname: string;
  department: string;
  studentNumber: number;
}

/** 로그인 **/
export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  return data as { accessToken: string };
};

/** 회원정보 저장 **/
export const saveUserInfo = async () => {
  const { data } = await apiClient.get('/members/info');
  return data.data;
};

/** 회원가입 **/
export const registerMember = async (userData: RegisterReq) => {
  try {
    const response = await apiClient.post('/members', userData);

    return response.data;
  } catch (err: any) {
    throw err.response?.data || { message: '회원가입 요청 실패' };
  }
};

/** 이메일 중복 확인 **/
export const emailVerification = async (email: string) => {
  const { data } = await apiClient.post('/member/email/verify', { email });
  return data;
};

/** 이메일 인증 코드 검증  **/
export const verifyEmailCode = async (email: string, code: string) => {
  const { data } = await apiClient.post('/member/email/check', { email, code });
  return data.data.matched as boolean;
};
