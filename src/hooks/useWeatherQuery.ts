import { useQuery } from '@tanstack/react-query';
import { fetchWeatherInfo } from '../api/weatherApi';

export const useWeatherQuery = () => {
  return useQuery({
    queryKey: ['weather'],
    queryFn: fetchWeatherInfo,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};
