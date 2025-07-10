import type { NewsInfo } from '../../types/news/newsInfo';
import apiClient from '../apiClient';

export const fetchNewsInfo = async (category: string): Promise<NewsInfo> => {
  try {
    const response = await apiClient.get('/news', { params: { category } });
    return response.data;
  } catch (e) {
    console.log('news fetching at MAINPAGE 오류', e);
    throw e;
  }
};
