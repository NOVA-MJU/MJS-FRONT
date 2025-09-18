/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';
import type {
  ApiResponse,
  EmailVerifyResponse,
  ResetPasswordResponse,
  RegisterReq,
} from '../types/api';

/** 로그인 **/
export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post('/auth/login', { email, password });
  sessionStorage.setItem('accessToken', data.accessToken);
  sessionStorage.setItem('refreshToken', data.refreshToken);
  return data;
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
    throw err.response?.data || { message: '회원가입 요청 실패', code: 'unknown' };
  }
};

/** 이메일 중복 및 도메인 유효성 검사 **/
export const checkEmailValidation = async (email: string) => {
  try {
    const response = await apiClient.get('/members/validation/email', {
      params: { email },
    });

    return response.data;
  } catch (err: any) {
    throw err?.response?.data || { message: '이메일 유효성 검사 실패' };
  }
};

/** 닉네임 중복 검증 **/
export const checkNicknameValidation = async (nickname: string) => {
  try {
    const response = await apiClient.get('/members/validation/nickname', {
      params: { nickname },
    });

    return response.data;
  } catch (err: any) {
    throw err?.response?.data || { message: '닉네임 유효성 검사 실패' };
  }
};

/** 학번 중복 검증 **/
export const checkStuCodeValidation = async (studentCode: string) => {
  try {
    const response = await apiClient.get('/members/validation/student-number', {
      params: { studentNumber: studentCode },
    });

    return response.data;
  } catch (err: any) {
    throw err?.response?.data || { message: '학번 유효성 검사 실패' };
  }
};

/** 이메일 인증코드 발송 **/
export const emailVerification = async (email: string) => {
  const { data } = await apiClient.post('/member/email/verify', { email });
  return data;
};

/** 이메일 인증 코드 체크 **/
export const verifyEmailCode = async (email: string, code: string) => {
  const { data } = await apiClient.post('/member/email/check', { email, code });
  return data.data.matched as boolean;
};

/** 프로필 이미지 업로드 API */
export const uploadProfileImage = async (imageFile: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await apiClient.post('/members/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: false,
    });
    return response.data.data as string;
  } catch (err: any) {
    throw err?.response?.data || { message: '프로필 이미지 업로드 실패' };
  }
};

/** 회원 탈퇴  **/
export const deleteUser = async (password: string) => {
  console.log('[deleteUser API 호출] 비밀번호:', password);

  try {
    const res = await apiClient.delete('/members/info', {
      data: { password },
    });

    console.log('[deleteUser API 응답 status]:', res.status);
    return res.status;
  } catch (error) {
    console.error('[deleteUser API 오류]', error);
    throw error;
  }
};

/** 비밀번호 찾기 시 이메일 인증코드 발송 */
export const sendEmailExists = async (email: string): Promise<boolean> => {
  const { data } = await apiClient.post<EmailVerifyResponse>('/member/email/verify', { email });
  console.log('[sendEmailExists] raw response:', data);
  return !!data.data;
};

/** 회원 계정 복구 - 코드 검증 및 내부 플래그 세팅 */
export const sendAuthority = async (email: string, code: string): Promise<boolean> => {
  const payload = { email, code };

  const res = await apiClient.post<ApiResponse<string>>('/members/recovery/verify-code', payload);
  console.log('[sendAuthority] res:', res.status, res.data);
  return (
    res.status === 200 &&
    (!!res.data.data || ['SUCCESS', 'API 요청 성공'].includes(res.data.status as any))
  );
};

/** 회원 계정 복구 - 비밀번호 재설정 */
export const changePassword = async (email: string, newPassword: string): Promise<boolean> => {
  const { data } = await apiClient.post<ResetPasswordResponse>('/members/recovery/reset', {
    email,
    newPassword,
  });
  return data.status === 'SUCCESS';
};
