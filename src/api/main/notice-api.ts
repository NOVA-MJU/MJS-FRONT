import apiClient from '../apiClient';
import type { NoticeResponse } from '../../types/notice/noticeInfo';

export const fetchNotionInfo = async (
  category: string,
  year?: number,
  page = 0,
  size = 5,
  sort: 'asc' | 'desc' = 'desc',
): Promise<NoticeResponse> => {
  try {
    const response = await apiClient.get('/notices', {
      params: { category, page, size, sort, ...(year ? { year } : {}) },
    });
    return response.data;
  } catch (e) {
    console.log('공지사항 api fetching 간 오류 발생', e);
    throw e;
  }
};
