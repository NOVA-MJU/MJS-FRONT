'use client';

import { useWeatherQuery } from '../../../hooks/useWeatherQuery';

const WeatherComponent = () => {
  const { data, isLoading, isError } = useWeatherQuery();

  if (isLoading) {
    return (
      <div className='rounded-xl border px-4 py-4 bg-white shadow-md w-full max-w-xs text-sm text-gray-500'>
        날씨 정보를 불러오는 중...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='rounded-xl border px-4 py-4 bg-white shadow-md w-full max-w-xs text-sm text-red-500'>
        날씨 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className='rounded-xl border border-grey-20 px-4 py-4 bg-white shadow-md w-full '>
      <div className='text-sm text-gray-500 mb-2'>{data.location} 현재 날씨</div>

      <div className='flex items-center space-x-4'>
        <img src={data.weatherIcon} alt='날씨 아이콘' className='w-12 h-12' />
        <div>
          <div className='text-2xl font-bold'>{Math.round(data.temperature)}°C</div>
          <div className='text-sm text-gray-500'>
            {Math.round(data.minTemperature)}° | {Math.round(data.maxTemperature)}°
          </div>
        </div>
      </div>

      <div className='mt-4 text-xs text-gray-700 space-y-1'>
        <div>체감 온도: {Math.round(data.feelsLike)}°C</div>
        <div>습도: {data.humidity}%</div>
        <div>
          초미세먼지: {data.pm2_5} ({data.pm2_5Category})
        </div>
        <div>
          미세먼지: {data.pm10} ({data.pm10Category})
        </div>
      </div>
    </div>
  );
};

export default WeatherComponent;
