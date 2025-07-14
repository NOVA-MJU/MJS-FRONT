/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from './apiClient';

export interface MenuItem {
  date: string;
  menuCategory: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  meals: string[];
}

export const getMenus = async () => {
  try {
    const { data } = await apiClient.get<{
      status: string;
      data: MenuItem[];
    }>('/menus');
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || '식단표 조회 실패');
  }
};
