import apiClient from './apiClient';
import { type ApiResponse, type Paginated } from './types';

/**
 * 게시글 목록을 조회합니다.
 *
 * @param page 페이지네이션 정보를 입력하세요.
 * @param size 페이지네이션 정보를 입력하세요.
 */
export const getBoards = async (page = 0, size = 10) => {
  const { data } = await apiClient.get<ApiResponse<Paginated<BoardItem>>>('/boards', {
    params: { page, size },
  });
  return data.data;
};

export interface BoardItem {
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
  popular: true;
}

/**
 * 게시글을 새롭게 등록합니다.
 *
 * @param title 생성할 게시글의 제목을 입력하세요.
 * @param content 생성할 게시글의 본문을 입력하세요. `json` 형식의 `BlockTextEditor` 의 형식이어야합니다.
 * @param contentPreview 생성할 게시글의 미리보기를 입력하세요. 게시글의 미리보기 추출은 `BlockTextEditor` 의 `getBlockTextEditorContentPreview` 를 사용하세요.
 * @returns 생성된 게시글의 uuid를 반환합니다.
 */
export const postBoard = async (
  title: string,
  content: string,
  contentPreview: string,
  published = true,
): Promise<string> => {
  const res = await apiClient.post<ApiResponse<{ uuid: string }>>('/boards', {
    title,
    content,
    contentPreview,
    published,
  });
  return res.data.data.uuid;
};

/**
 * 게시글 상세 조회
 *
 * @param uuid 조회할 게시글의 uuid를 입력하세요
 */
export const getBoardDetail = async (uuid: string) => {
  const response = await apiClient.get<ApiResponse<GetBoardDetailRes>>(`/boards/${uuid}`);
  return response.data.data;
};

export interface GetBoardDetailRes {
  uuid: string;
  title: string;
  content: string;
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
 * 게시글 수정
 *
 * @param boardUuid 수정할 게시글의 `uuid`를 입력하세요.
 * @param title 수정할 게시글의 제목을 입력하세요.
 * @param content 수정할 게시글의 본문을 입력하세요. `json` 형식의 `BlockTextEditor` 의 형식이어야합니다.
 * @param contentPreview 수정할 게시글의 미리보기를 입력하세요. 게시글의 미리보기 추출은 `BlockTextEditor` 의 `getBlockTextEditorContentPreview` 를 사용하세요.
 * @returns 생성된 게시글의 uuid를 반환합니다
 */
export const updatePost = async (
  boardUuid: string,
  title: string,
  content: string,
  contentPreview: string,
  published = true,
) => {
  const res = await apiClient.patch<ApiResponse<{ uuid: string }>>(`/boards/${boardUuid}`, {
    title,
    content,
    contentPreview,
    published,
  });
  return res.data.data.uuid;
};

/**
 * 게시글 삭제
 *
 * @param boardUuid 삭제할 게시글의 `uuid`를 입력하세요.
 */
export const deletePost = async (boardUuid: string) => {
  const response = await apiClient.delete(`/boards/${boardUuid}`);
  return response.data;
};

/**
 * 게시글 댓글 조회
 *
 * @param boardUuid 댓글을 조회할 게시글의 uuid를 입력하세요
 */
export const getBoardComments = async (boardUuid: string) => {
  const response = await apiClient.get<{
    status: string;
    data: CommentRes[];
  }>(`/boards/${boardUuid}/comments`);
  return response.data.data;
};

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
 * 게시글 댓글 작성
 */
export const postComment = async (boardUuid: string, content: string) => {
  const response = await apiClient.post(`/boards/${boardUuid}/comments`, { content });
  return response.data.data;
};

/**
 * 게시글 좋아요 표시
 */
export const likePost = async (boardUuid: string) => {
  const response = await apiClient.post(`/boards/${boardUuid}/like`);
  return response.data;
};

/**
 * @deprecated 서버에서 비활성화된 `api`이므로 요청 시 오류가 발생할 수 있습니다.
 *
 * 이미지를 s3 버킷에 업로드하는 요청 함수입니다. 이미지는 폼 데이터 형식으로 전달됩니다.
 *
 * @param file 업로드할 이미지를 입력하세요.
 * @param folderUuid 업로드할 이미지 폴더를 입력하세요.
 * @returns 업로드한 이미지의 s3 주소를 반환합니다.
 */
export const uploadImage = async (file: File, folderUuid: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tempFolderUuid', folderUuid);

  const response = await apiClient.post('/boards/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

/**
 * @deprecated 서버에서 비활성화된 `api`이므로 요청 시 오류가 발생할 수 있습니다.
 * 이미지 폴더 신규 발급
 */
export const getTempImageFolderUuid = async (): Promise<ApiResponse<string>> => {
  const res = await apiClient.get<ApiResponse<string>>('/boards/temp-uuid');
  return res.data;
};
