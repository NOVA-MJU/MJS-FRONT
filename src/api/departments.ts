import apiClient from './apiClient';
import type { ApiResponse, Paginated } from './types';

/**************************************************
 **************** 학과별 정보 조회 기능 ****************
 **************************************************/

/**
 * /departments/info
 * 학과 목록을 조회합니다
 * @param college 필터링할 단과대학을 입력하세요
 * @returns Department[] 형태의 학과 목록을 반환합니다
 */
export const getDepartments = async (college?: string) => {
  const res = await apiClient.get<ApiResponse<DepartmentRes[]>>('/departments/info', {
    params: college ? { college } : undefined,
  });
  return res.data.data;
};

export interface DepartmentRes {
  departmentUuid: string;
  departmentName: string;
  studentCouncilName: string | null;
  studentCouncilLogo: string | null;
  slogan: string;
  college: string;
}

/**
 * /departments/info/{departmentUuid}
 * 특정 학과의 학생회, 슬로전, 설명, SNS 정보 등 상세 정보를 조회합니다
 * @param uuid 학과의 uuid를 입력하세요
 * @returns 학과 상세 정보를 반환합니다
 */
export const getDepartmentDetail = async (departmentUuid: string): Promise<DepartmentDetailRes> => {
  const res = await apiClient.get<ApiResponse<DepartmentDetailRes>>(
    `/departments/info/${departmentUuid}`,
  );
  return res.data.data;
};

export interface DepartmentDetailRes {
  departmentUuid: string;
  departmentName: string;
  studentCouncilName: string | null;
  studentCouncilLogo: string | null;
  studentCouncilContactEmail: string | null;
  slogan: string;
  description: string;
  instagramUrl: string;
  homepageUrl: string;
  college: string;
}

/**
 * /departments/{departmentUuid}/schedules
 * 해당 학과에 등록된 전체 일정을 조회합니다. 각 일정은 제목, 기간, 내용 등의 정보를 포함합니다.
 * @param uuid 학과의 uuid를 입력하세요
 * @returns 학과 일정 목록 반환
 */
export const getDepartmentSchedules = async (
  departmentUuid: string,
): Promise<DepartmentSchedulesRes> => {
  const res = await apiClient.get<ApiResponse<DepartmentSchedulesRes>>(
    `/departments/${departmentUuid}/schedules`,
  );
  return res.data.data;
};

export interface DepartmentSchedulesRes {
  schedules: DepartmentSchedule[];
}

interface DepartmentSchedule {
  departmentScheduleUuid: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  content: string;
}

/**
 * /departments/{departmentUuid}/notices
 * 특정 학과의 최신 공지사항 목록을 페이징 형태로 조회합니다. 기본 size는 5이며, 각 공지는 제목, 썸네일, 미리보기 내용, 등록일을 포함합니다.
 * @param uuid
 * @param page
 * @param size
 * @returns 공지사항 paginated list 반환
 */
export const getDepartmentNotices = async (
  departmentUuid: string,
  page: number,
  size: number,
): Promise<Paginated<NoticeItem>> => {
  const res = await apiClient.get<ApiResponse<Paginated<NoticeItem>>>(
    `/departments/${departmentUuid}/notices`,
    { params: { page, size } },
  );
  return res.data.data;
};

interface NoticeItem {
  createdAt: string;
  noticeUuid: string;
  previewContent: string;
  thumbnailUrl: string;
  title: string;
}
