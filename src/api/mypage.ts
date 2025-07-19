import apiClient from './apiClient';

export interface ProfileStatsRes {
  postCount: number;
  commentCount: number;
  likedPostCount: number;
}

export const getProfileStats = async (): Promise<ProfileStatsRes> => {
  const res = await apiClient.get('/profile');
  return res.data.data;
};
