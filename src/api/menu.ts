import apiClient from './apiClient';
import type { ApiResponse } from './types';

export interface MenuItem {
  date: string;
  menuCategory: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  meals: string[];
}

export const getMenus = async () => {
  if (import.meta.env.DEV) {
    console.log('[menus] GET /menus request');
  }
  const res = await apiClient.get<ApiResponse<MenuItem[]>>('/menus');
  if (import.meta.env.DEV) {
    console.log('[menus] GET /menus response', {
      items: res.data.data?.length ?? 0,
      firstDate: res.data.data?.[0]?.date,
    });
  }
  return res.data.data;
};
