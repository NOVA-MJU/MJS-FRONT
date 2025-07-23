/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface CalendarEventItem {
  year: number;
  startDate: string;
  endDate: string;
  description: string;
}

export const getAcademicEvents = async ({
  page = 0,
  size = 10,
  sortBy = 'endDate',
  sortDir = 'asc',
  year = 2025,
}: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  year: number;
}) => {
  try {
    const { data } = await apiClient.get('/calendar', {
      params: { page, size, sortBy, sortDir, year },
    });
    return data.data.content;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '캘린더 조회 실패');
  }
};
