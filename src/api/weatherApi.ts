import type { WeatherInfo } from '../types/weatherInfo';
import apiClient from './apiClient';

export const fetchWeatherInfo = async (): Promise<WeatherInfo> => {
  try {
    const response = await apiClient.get<WeatherInfo>('/weather');
    return response.data;
  } catch (e) {
    console.error('fetching weather api 오류:', e);
    throw e;
  }
};
