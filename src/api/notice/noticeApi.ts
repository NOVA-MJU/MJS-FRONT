import apiClient from '../apiClient';
import type { NoticeResponse } from '../../types/notice/noticeInfo';

export const fetchNotionInfo = async (
  category: string,
  year = new Date().getFullYear(),
  page = 0,
  size = 15,
  sort: 'asc' | 'desc' = 'asc',
): Promise<NoticeResponse> => {
  try {
    const response = await apiClient.get('/notices', {
      params: { category, year, page, size, sort },
    });
    return response.data;
  } catch (e) {
    console.log('공지사항 api fetching 간 오류 발생', e);
    throw e;
  }
};
