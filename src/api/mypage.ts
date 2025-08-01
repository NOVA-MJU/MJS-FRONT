import apiClient from './apiClient';

export interface ProfileStatsRes {
  postCount: number;
  commentCount: number;
  likedPostCount: number;
}

export interface Content {
  uuid: string;
  title: string;
  previewContent: string;
  viewCount: number;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  author: string;
  liked: boolean;
}

/** 회원 통계 정보 **/
export const getProfileStats = async (): Promise<ProfileStatsRes> => {
  const res = await apiClient.get('/profile');
  return res.data.data;
};

/** 내 게시글 조회 **/

export const getMyPost = async (): Promise<Content[]> => {
  const res = await apiClient.get('/profile/posts');
  console.log('게시글 조회:', res.data.data);
  return res.data.data; // Content[] 형태
};
/** 내 좋아요 조회 **/
export const getMyLikes = async () => {
  const res = await apiClient.get('/profile/liked_posts');
  console.log('좋아요 조회:', res.data.data);
  return res.data.data;
};

/** 내 댓글 조회 **/
export const getMyComments = async () => {
  const res = await apiClient.get('/profile/comments');
  console.log('댓글 조회:', res.data.data);
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
