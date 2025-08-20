import apiClient from './apiClient';
import type { ApiResponse, Paginated } from './types';

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

/**
 * 검색어 자동완성 요청.
 * @param keyword 검색어를 입력하세요.
 * @returns 자동완성 키워드 배열을 return 합니다.
 */
export const getSearchWordcompletion = async (keyword: string) => {
  const res = await apiClient.get<ApiResponse<string[]>>('/search/suggest', {
    params: { keyword },
  });
  return res.data.data;
};

/**
 * 키워드와 카테고리를 이용해서 검색을 수행합니다.
 * @param keyword 검색할 키워드를 입력하세요.
 * @param type 검색할 게시판을 선택하세요.
 * @param page 페이지네이션 페이지를 입력하세요.
 * @param size 페이지네이션 크기를 입력하세요.
 * @returns 검색 결과 배열이 리턴됩니다.
 */
export const getSearchResult = async (
  keyword: string,
  type:
    | 'NOTICE'
    | 'NEWS'
    | 'COMMUNITY'
    | 'DEPARTMENT_NOTICE'
    | 'DEPARTMENT_SCHEDULE'
    | 'BROADCAST'
    | 'MJU_CALENDAR',
  page = 0,
  size = 10,
) => {
  const res = await apiClient.get<ApiResponse<Paginated<GetSearchResultRes>>>('/search/detail', {
    params: { keyword, type, page, size },
  });
  return res.data.data;
};

export interface GetSearchResultRes {
  id: string;
  highlightedTitle: string;
  highlightedContent: string;
  date: string;
  link: string;
  category: string;
  type: string;
  imageUrl: string;
  score: number;
}
