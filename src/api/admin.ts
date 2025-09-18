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
    { title, content, contentPreview, thumbnailUrl },
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

/**
 * 학과 공지사항을 삭제합니다.
 * @param departmentUuid 현재 관리하고있는 학과의 uuid를 입력하세요.
 * @param noticeUuid 삭제할 공지사항의 uuid를 입력하세요.
 * @returns
 */
export const deleteDepartmentNotice = async (departmentUuid: string, noticeUuid: string) => {
  const res = await apiClient.delete<ApiResponse<string>>(
    `/admin/departments/${departmentUuid}/notices/${noticeUuid}`,
  );
  return res.data.data;
};

/**
 * 학과 공지사항을 수정합니다.
 * @param departmentUuid 현재 관리하고있는 학과의 uuid를 입력하세요.
 * @param noticeUuid 수정할 공지사항의 uuid를 입력하세요.
 * @param title 업데이트할 공지사항의 제목을 입력하세요.
 * @param content 업데이트할 공지사항의 본문을 입력하세요.
 * @param contentPreview 업데이트할 공지사항의 컨텐츠 미리보기를 입력하세요.
 * @param thumbnailUrl 업데이트할 공지사항의 썸네일을 입력하세요.
 * @returns
 */
export const updateDepartmentNotice = async (
  departmentUuid: string,
  noticeUuid: string,
  title: string,
  content: string,
  contentPreview: string,
  thumbnailUrl: string,
) => {
  const res = await apiClient.patch<ApiResponse<WriteDepartmentNoticeRes>>(
    `/admin/departments/${departmentUuid}/notices/${noticeUuid}`,
    { title, content, contentPreview, thumbnailUrl },
  );
  return res.data.data;
};

/**********************************
 *           어드민 캘린더           *
 **********************************/

/**
 * 학과의 새로운 일정을 추가합니다.
 * @param departmentUuid 현재 관리하고있는 학과의 uuid를 입력하세요.
 * @param scheduleUuid 새롭게 등록할 일정의 uuid를 입력하세요.
 * @param title 새롭게 등록할 일정의 제목을 입력하세요.
 * @param content 새롭게 등록할 일정의 본문을 입력하세요.
 * @param colorCode 새롭게 등록할 일정의 리본 색을 입력하세요.
 * @param startDate 새롭게 등록할 일정의 시작 날짜를 입력하세요.
 * @param endDate 새롭게 등록할 일정의 종료 날짜를 입력하세요.
 * @returns 새롭게 등록된 일정의 정보가 return 됩니다.
 */
export const postDepartmentSchedule = async (
  departmentUuid: string,
  scheduleUuid: string,
  title: string,
  content: string,
  colorCode: string,
  startDate: string,
  endDate: string,
) => {
  const res = await apiClient.post<ApiResponse<PostDepartmentScheduleRes>>(
    `/admin/department/${departmentUuid}/schedules/${scheduleUuid}`,
    { title, content, colorCode, startDate, endDate },
  );
  return res.data.data;
};

interface PostDepartmentScheduleRes {
  departmentScheduleUuid: string;
  title: string;
  content: string;
  colorCode: string;
  startDate: string;
  endDate: string;
}

/**
 * 학과에 등록되어있는 일정을 삭제합니다.
 * @param departmentUuid 관리하고있는 학과의 uuid를 입력하세요.
 * @param scheduleUuid 삭제할 일정의 uuid를 입력하세요.
 * @returns 실행 결과가 return됩니다.
 */
export const deleteDepartmentSchedule = async (departmentUuid: string, scheduleUuid: string) => {
  const res = await apiClient.delete<ApiResponse<string>>(
    `/admin/department/${departmentUuid}/schedules/${scheduleUuid}`,
  );
  return res.data.data;
};
