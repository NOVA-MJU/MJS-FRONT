import apiClient from '../apiClient';
import { type ApiResponse, type Paginated } from '../types';

/**
 * 명지대학교 방송국의 전체 영상 목록을 조회합니다. 페이지네이션 및 최신순 정렬을 지원합니다
 * @param page 페이지네이션 번호를 입력하세요
 * @param size 한번에 불러올 데이터 갯수를 입력하세요
 * @returns 페이지네이션된 BroadcastItem[]를 반환합니다
 */
export const fetchBroadCastInfo = async (page: number = 0, size: number = 9) => {
  const res = await apiClient.get<ApiResponse<Paginated<BroadcastItem>>>('/broadcast', {
    params: { page, size },
  });
  return res.data.data;
};

export interface BroadcastItem {
  title: string;
  url: string;
  thumbnailUrl: string;
  playlistTitle: string;
  publishedAt: string;
}
