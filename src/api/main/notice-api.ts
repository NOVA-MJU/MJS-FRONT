import apiClient from '../apiClient';
import type { NoticeResponse } from '../../types/notice/noticeInfo';

export const fetchNotionInfo = async (
  category: string,
  year?: number,
  page = 0,
  size = 8,
  sort: 'asc' | 'desc' = 'desc',
): Promise<NoticeResponse> => {
  const response = await apiClient.get('/notices', {
    params: { category, page, size, sort, ...(year ? { year } : {}) },
  });
  return response.data;
};
