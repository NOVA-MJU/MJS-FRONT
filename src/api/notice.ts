import apiClient from './apiClient';

export interface NoticeQuery {
  category: 'general' | 'academic' | 'scholarship' | 'career' | 'activity' | 'rule';
  year?: number;
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
}

/** 공지사항 리스트 불러오기 **/
export const fetchNotices = async ({
  category,
  page = 0,
  size = 15,
  sort = 'desc',
  year = new Date().getFullYear(),
}: {
  category: string;
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
  year?: number;
}) => {
  const { data } = await apiClient.get('/notices', {
    params: { category, page, size, sort, year },
  });
  return data;
};
