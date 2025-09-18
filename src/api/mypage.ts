import apiClient from './apiClient';
import { type ApiResponse } from './types';

/**
 * 회원 통계 정보
 */
export const getProfileStats = async (): Promise<ProfileStatsRes> => {
  const res = await apiClient.get('/profile');
  return res.data.data;
};
export interface ProfileStatsRes {
  postCount: number;
  commentCount: number;
  likedPostCount: number;
}

/**
 * 내 댓글 조회
 */
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

/**
 * 내가 쓴 게시글 목록을 조회합니다.
 * @returns 게시글 목록을 반환합니다.
 */
export const getMyPosts = async () => {
  const res = await apiClient.get<ApiResponse<MyPostItem[]>>('/profile/posts');
  return res.data.data;
};
export interface MyPostItem {
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

/**
 * 내가 댓글 단 게시글을 조회합니다.
 * @returns 게시글 목록을 반환합니다.
 */
export const getMyCommentedPosts = async () => {
  const res = await apiClient.get<ApiResponse<MyCommentedPostItem[]>>('/profile/comments');
  return res.data.data;
};
export interface MyCommentedPostItem {
  author: string;
  boardCreatedAt: string;
  boardIsLiked: boolean;
  boardLikeCount: number;
  boardPreviewContent: string;
  boardPublished: boolean;
  boardTitle: string;
  boardUuid: string;
  boardViewCount: number;
  commentCreatedAt: string;
  commentIsLiked: boolean;
  commentLikeCount: number;
  commentPreviewContent: string;
  commentUuid: string;
}

/**
 * 내가 좋아요 누른 게시글을 조회합니다.
 * @returns 게시글 목록을 반환합니다.
 */
export const getMyLikedPosts = async () => {
  const res = await apiClient.get<ApiResponse<MyPostItem[]>>('/profile/liked_posts');
  return res.data.data;
};
