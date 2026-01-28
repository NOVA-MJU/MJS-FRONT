import apiClient from './apiClient';
import type { ApiResponse, Paginated } from './types';
import { CALENDAR_API_DEFAULT_SIZE } from '../constants/common';

/**
 * 명지대학교의 학사일정 데이터를 페이지 단위로 조회합니다
 * @param page 페이지 번호
 * @param size 페이지당 항목 수
 * @param sortBy 정렬 기준 필드
 * @param sortDir 정렬 방향
 * @param year 조회할 년도를 입력합니다
 * @returns CalendarEventItem[] 배열과, pagination 정보를 반환합니다
 */
interface CalendarEventItem {
  year: number;
  startDate: string;
  endDate: string;
  description: string;
}

/**
 * @deprecated
 * @param param0
 * @returns
 */
export const getAcademicEvents = async ({
  page = 0,
  size = CALENDAR_API_DEFAULT_SIZE,
  sortBy = 'startDate',
  sortDir = 'asc',
  year = 2025,
}: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  year: number;
}) => {
  const { data } = await apiClient.get<ApiResponse<Paginated<CalendarEventItem>>>('/calendar', {
    params: { page, size, sortBy, sortDir, year },
  });
  return data.data.content;
};
