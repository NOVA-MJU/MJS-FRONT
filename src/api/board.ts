import apiClient from './apiClient';
import { type ApiResponse, type Paginated } from './types';

/**
 *     ____                       __
 *    / __ )____  ____ __________/ /
 *   / __  / __ \/ __ `/ ___/ __  /
 *  / /_/ / /_/ / /_/ / /  / /_/ /
 * /_____/\____/\__,_/_/   \__,_/
 */

/**
 * 게시글 목록을 조회합니다.
 * @param page 페이지네이션 정보를 입력하세요.
 * @param size 페이지네이션 정보를 입력하세요.
 * @param sortBy 정렬 기준을 입력하세요. 기본값을 'createdAt' 입니다.
 * @param direction 정렬 순서를 입력하세요.
 */
type BoardSortBy = 'createdAt' | 'title' | 'likeCount' | 'commentCount';

export const getBoards = async (
  page = 0,
  size = 10,
  sortBy: BoardSortBy = 'createdAt',
  direction = 'DESC',
) => {
  const { data } = await apiClient.get<ApiResponse<Paginated<BoardItem>>>('/boards', {
    params: { page, size, sortBy, direction },
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
  canEdit: boolean;
  canDelete: boolean;
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
 * 게시글 좋아요 표시
 */
export const likePost = async (boardUuid: string) => {
  const response = await apiClient.post<ApiResponse<string>>(`/boards/${boardUuid}/like`);
  return response.data;
};

/**
 *     ____                       __   ______                                     __
 *    / __ )____  ____ __________/ /  / ____/___  ____ ___  ____ ___  ___  ____  / /_
 *   / __  / __ \/ __ `/ ___/ __  /  / /   / __ \/ __ `__ \/ __ `__ \/ _ \/ __ \/ __/
 *  / /_/ / /_/ / /_/ / /  / /_/ /  / /___/ /_/ / / / / / / / / / / /  __/ / / / /_
 * /_____/\____/\__,_/_/   \__,_/   \____/\____/_/ /_/ /_/_/ /_/ /_/\___/_/ /_/\__/
 */

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
  profileImageUrl?: string;
  likeCount: number;
  createdAt: string;
  liked: boolean;
  replies: CommentRes[];
  commentIsAuthor: boolean;
}

/**
 * 게시글 댓글 작성
 */
export const postComment = async (boardUuid: string, content: string) => {
  const response = await apiClient.post(`/boards/${boardUuid}/comments`, { content });
  return response.data.data;
};

/**
 * 게시글 댓글에 대댓글을 작성합니다
 * @param boardUUID 게시글의 uuid를 입력하세요
 * @param parentCommentUUID 부모 댓글의 uuid를 입력하세요
 * @param content 새롭게 등록할 대댓글의 content를 입력하세요
 * @returns 등록된 대댓글 정보를 return합니다
 */
export const postCommentReply = async (
  boardUUID: string,
  parentCommentUUID: string,
  content: string,
) => {
  const res = await apiClient.post<ApiResponse<CommentRes>>(
    `/boards/${boardUUID}/comments/${parentCommentUUID}/reply`,
    {
      content,
    },
  );
  return res.data.data;
};

/**
 * 게시글 댓글 삭제
 * @param boardUuid 게시글의 uuid를 입력하세요
 * @param commentUuid 댓글의 uuid를 입력하세요
 * @returns 서버 메시지가 표시됩니다
 */
export const deleteComment = async (boardUuid: string, commentUuid: string) => {
  const res = await apiClient.delete<ApiResponse<string>>(
    `/boards/${boardUuid}/comments/${commentUuid}`,
  );
  return res.data.data;
};

/**
 * 게시글 댓글 좋아요 표시
 * @param boardUuid 게시글의 uuid를 입력하세요
 * @param commentUuid 댓글의 uuid를 입력하세요
 * @returns 서버 메시지가 표시됩니다
 */
export const toggleLikeComment = async (boardUuid: string, commentUuid: string) => {
  const res = await apiClient.post<ApiResponse<string>>(
    `/boards/${boardUuid}/comments/${commentUuid}/like`,
  );
  return res.data.data;
};

/**
 *        __                                __           __
 *   ____/ /__  ____  ________  _________ _/ /____  ____/ /
 *  / __  / _ \/ __ \/ ___/ _ \/ ___/ __ `/ __/ _ \/ __  /
 * / /_/ /  __/ /_/ / /  /  __/ /__/ /_/ / /_/  __/ /_/ /
 * \__,_/\___/ .___/_/   \___/\___/\__,_/\__/\___/\__,_/
 *          /_/
 */

/**
 * @deprecated 서버에서 비활성화된 `api`이므로 요청 시 오류가 발생할 수 있습니다.
 * 이미지를 s3 버킷에 업로드하는 요청 함수입니다. 이미지는 폼 데이터 형식으로 전달됩니다.
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
