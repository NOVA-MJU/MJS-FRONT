import type { MealInfo } from '../../types/meal/mealInfo';
import apiClient from '../apiClient';

export const fetchMealInfo = async (): Promise<MealInfo> => {
  try {
    const response = await apiClient.get('/menus');
    return response.data;
  } catch (e) {
    console.error('식단 정보를 불러오는 중 오류 발생:', e);
    throw e;
  }
};
