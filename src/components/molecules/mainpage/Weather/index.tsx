import { useWeatherQuery } from '../../../../hooks/useWeatherQuery';

const WeatherComponent = () => {
  const { data, isLoading, isError } = useWeatherQuery();

  if (isLoading) {
    return (
      <div className='rounded-2xl border border-blue-05 bg-white shadow-sm w-full p-5 text-sm text-gray-500'>
        날씨 정보를 불러오는 중...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='rounded-2xl border border-blue-05 bg-white shadow-sm w-full p-5 text-sm text-red-500'>
        날씨 정보를 불러올 수 없습니다.
      </div>
    );
  }

  // 안전 가공
  const hour = new Date().getHours();
  const temp = Math.round(data.temperature ?? 0);
  const tMin = Math.round(data.minTemperature ?? 0);
  const tMax = Math.round(data.maxTemperature ?? 0);
  const feelsLike = Math.round(data.feelsLike ?? temp);
  const humidity = Math.round(data.humidity ?? 0);
  const pm10Cat = data.pm10Category ?? '-';
  const pm25Cat = data.pm2_5Category ?? '-';
  const icon = data.weatherIcon ?? '/placeholder-weather.png';

  return (
    <div className='rounded-2xl border border-blue-05 bg-white shadow-sm w-full p-5 md:p-6'>
      <div className='text-mju-primary font-bold text-xl md:text-2xl mb-3'>
        {data.location} 날씨
      </div>
      <div className='flex'>
        <span className='ml-auto text-grey-40'>{hour}시 기준</span>
      </div>

      {/* 상단: 아이콘 + 현재기온 / 최저|최고 */}
      <div className='flex items-center gap-4 md:gap-6'>
        <img
          src={icon}
          alt='날씨 아이콘'
          className='w-20 h-20 rounded-xl object-cover flex-shrink-0'
        />
        <div>
          <div className='text-2xl text-black font-bold tracking-tight'>{temp}°C</div>
          <div className='text-grey-40 mt-1  text-xl md:text-lg'>
            {tMin}°C <span className='mx-2'>|</span> {tMax}°C
          </div>
        </div>
      </div>

      {/* 하단 지표: 강수확률 / 습도 / 미세먼지 / 초미세먼지 */}
      <div className='mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm md:text-base text-gray-700'>
        <div className='flex items-center gap-1'>
          <span className='font-medium'>습도</span>
          <span className='text-grey-40'>{humidity}%</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-medium'>미세먼지</span>
          <span className='text-grey-40'>{pm10Cat}</span>
        </div>
        <div className='flex items-center gap-1'>
          <span className='font-medium'>초미세먼지</span>
          <span className='text-grey-40'>{pm25Cat}</span>
        </div>
      </div>

      <div className='flex'>
        <div className='mt-2 text-xs text-black '>체감 온도 {feelsLike}°C</div>
      </div>
    </div>
  );
};

export default WeatherComponent;
