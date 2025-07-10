/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface BoardItem {
  uuid: string;
  title: string;
  previewContent: string;
  contentImages: string[];
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

export interface BoardListData {
  content: BoardItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
  sort: string;
  pageable: string;
}

export interface PostBoardReq {
  title: string;
  content: string;
  published: boolean;
  contentImages: string[];
}

export interface PostBoardRes {
  status: string;
  uuid: string;
  title: string;
  content: string;
  contentImages: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardDetailRes {
  uuid: string;
  title: string;
  content: string;
  contentImages: string[];
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

export interface CommentRes {
  commentUUID: string;
  content: string;
  nickname: string;
  likeCount: number;
  createdAt: string;
  liked: boolean;
  replies: Comment[];
}

/**
 * 게시글 목록 조회
 */
export const getBoards = async (page = 0, size = 10) => {
  try {
    const { data } = await apiClient.get<{
      status: string;
      data: BoardListData;
    }>('/boards', { params: { page, size } });

    return data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '게시글 목록 조회 실패');
  }
};

/**
 * 게시글 작성
 */
export const postBoard = async (data: PostBoardReq) => {
  try {
    const response = await apiClient.post<{
      status: string;
      data: PostBoardRes;
      timestamp: string;
    }>('/boards', data);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '게시글 생성 실패');
  }
};

/**
 * 이미지 폴더 신규 발급
 */
export const getTempImageFolderUuid = async () => {
  try {
    const response = await apiClient.get('/boards/temp-uuid');
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '신규 이미지 폴더 발급 실패');
  }
};

/**
 * 이미지 업로드
 * 폼 데이터 형식으로 업로드됩니다
 */
export const uploadImage = async (file: File, folderUuid: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tempFolderUuid', folderUuid);

  try {
    const response = await apiClient.post('/boards/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '이미지 업로드 실패!');
  }
};

/**
 * 게시글 상세 조회
 */
export const getBoardDetail = async (uuid: string) => {
  try {
    const response = await apiClient.get<{
      status: string;
      data: BoardDetailRes;
    }>(`/boards/${uuid}`);
    return response.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '게시글 상세 조회 실패!');
  }
};

/**
 * 게시글 댓글 조회
 */
export const getBoardComments = async (boardUuid: string) => {
  try {
    const response = await apiClient.get<{
      status: string;
      data: CommentRes[];
    }>(`/boards/${boardUuid}/comments`);
    return response.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '댓글 상세 조회 실패!');
  }
};

/**
 * 게시글 댓글 작성
 */
export const postComment = async (boardUuid: string, content: string) => {
  try {
    const response = await apiClient.post(`/boards/${boardUuid}/comments`, { content });
    return response.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '댓글 작성 실패');
  }
};

/**
 * 게시글 삭제
 */
export const deletePost = async (boardUuid: string) => {
  try {
    const response = await apiClient.delete(`/boards/${boardUuid}`);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '게시글 삭제 실패');
  }
};

/**
 * 게시글 좋아요 표시
 */
export const likePost = async (boardUuid: string) => {
  try {
    const response = await apiClient.post(`/boards/${boardUuid}/like`);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '좋아요 실패');
  }
};
