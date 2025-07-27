import apiClient from './apiClient';

export interface ProfileStatsRes {
  postCount: number;
  commentCount: number;
  likedPostCount: number;
}

/** 회원 통계 정보 **/
export const getProfileStats = async (): Promise<ProfileStatsRes> => {
  const res = await apiClient.get('/profile');
  return res.data.data;
};

/** 회원정보 수정 **/
export const updateMemberInfo = async (body: {
  name: string;
  nickname: string;
  gender: string;
  departmentName: string;
  studentNumber: string;
  profileImageUrl: string;
}) => {
  const res = await apiClient.patch('/members/info', body);
  return res.data;
};

/** 비밀번호 변경 **/
export const changePassword = async (pw: string, newPw: string) => {
  const res = await apiClient.patch('/members/info/password', { password: pw, newPassword: newPw });
  return res.data;
};
