import apiClient from './apiClient';
import type { ApiResponse } from './types';

/**
 * /search/overview
 * 카테고리별로 상위 검색 결과 5개를 표시합니다
 * @param keyword 검색 키워드를 입력하세요
 */
interface SearchOverviewRes {
  broadcast: SearchResultItemRes[];
  community: SearchResultItemRes[];
  departmentNotice: SearchResultItemRes[];
  departmentSchedule: SearchResultItemRes[];
  mjuCalendar: SearchResultItemRes[];
  news: SearchResultItemRes[];
  notice: SearchResultItemRes[];
}

export interface SearchResultItemRes {
  id: number;
  highlightedTitle: string;
  highlightedContent: string;
  date: string;
  link: string;
  category: string;
  type: string;
  imageUrl: string;
  score: number;
}

export const getSearchOverview = async (keyword: string): Promise<SearchOverviewRes> => {
  const res = await apiClient.get<ApiResponse<SearchOverviewRes>>('/search/overview', {
    params: { keyword },
  });
  return res.data.data;
};
