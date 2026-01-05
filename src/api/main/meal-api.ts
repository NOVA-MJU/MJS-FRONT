import type { MealInfo } from '../../types/meal/mealInfo';
import apiClient from '../apiClient';

export const fetchMealInfo = async (): Promise<MealInfo> => {
  const response = await apiClient.get('/menus');
  return response.data;
};
