/**********************************
 *********** 어드민 페이지 ***********
 **********************************/

import apiClient from './apiClient';
import { type ApiResponse } from './types';

/**
 * 학과 공지사항을 새롭게 등록합니다.
 * @param departmentUuid 현재 관리하고있는 학과의 uuid를 입력하세요.
 * @param title 새롭게 등록할 공지사항의 제목을 입력하세요.
 * @param content 새롭게 등록할 공지사항의 본문을 입력하세요.
 * @param contentPreview 새롭게 등록할 공지사항의 미리보기를 입력하세요.
 * @param thumbnailUrl 새롭게 등록할 공지사항의 미리보기 이미지 주소를 입력하세요.
 * @returns 새롭게 등록된 게시글 정보가 리턴됩니다.
 */
export const writeDepartmentNotice = async (
  departmentUuid: string,
  title: string,
  content: string,
  contentPreview: string,
  thumbnailUrl?: string,
) => {
  const res = await apiClient.post<ApiResponse<WriteDepartmentNoticeRes>>(
    `/admin/departments/${departmentUuid}/notices`,
    {
      title: title,
      content: content,
      contentPreview: contentPreview,
      thumbnailUrl: thumbnailUrl,
    },
  );
  return res.data.data;
};

interface WriteDepartmentNoticeRes {
  uuid: string;
  title: string;
  content: string;
  contentPreview: string;
  thumbnailUrl: string;
  createAt: string;
}

/**
 * 학과 공지사항을 상세조회합니다.
 * @param departmentUuid 현재 관리하고있는 학과의 uuid를 입력하세요.
 * @param noticeUuid 조회할 공지사항의 uuid를 입력하세요.
 * @returns
 */
export const getDepartmentNoticeDetail = async (departmentUuid: string, noticeUuid: string) => {
  const res = await apiClient.get<ApiResponse<GetDepartmentNoticeDetailRes>>(
    `/admin/departments/${departmentUuid}/notices/${noticeUuid}`,
  );
  return res.data.data;
};

interface GetDepartmentNoticeDetailRes {
  uuid: string;
  title: string;
  content: string;
  contentPreview: string;
  thumbnailUrl: string;
  createAt: string;
}
