/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { weatherFetch } from '@/api/weatherApi';
import LoadingComponent from '../util/LoadingComponent';

const loadingContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 1rem;
  color: #555;
`;

const weatherContainerStyle = css`
  background-color: white;
  color: #001f5c;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Noto Sans KR', sans-serif;

  .weather-header {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 15px;
  }

  .current-time {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 10px;
    text-align: right;
  }

  .weather-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    position: relative;
  }

  .weather-icon {
    width: 80px;
    height: 80px;
    position: absolute;
    left: 0;
  }

  .temperature-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    .temperature {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .temp-range {
      font-size: 1rem;
      color: #555;
    }
  }

  .weather-details {
    font-size: 0.9rem;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .air-quality {
    margin-top: 15px;
    font-size: 0.9rem;
    color: #777;
  }
`;

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await weatherFetch();
        setWeatherData(data);
      } catch (error) {
        console.error('❌ 날씨 데이터를 불러오지 못했습니다.', error);
      }
    };

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
    };

    fetchWeather();
    updateTime();
  }, []);

  if (!weatherData) {
    return <LoadingComponent message="날씨 정보를 불러오는 중..." />;
  }

  return (
    <div css={weatherContainerStyle}>
      <div className="weather-header">{weatherData.location}</div>
      <div className="current-time">현재 시간: {currentTime}</div>
      <div className="weather-info">
        <img
          className="weather-icon"
          src={weatherData.weatherIcon}
          alt="날씨 아이콘"
        />
        <div className="temperature-container">
          <div className="temperature">{weatherData.temperature}°C</div>
          <div className="temp-range">
            최고: {weatherData.maxTemperature}°C | 최저:{' '}
            {weatherData.minTemperature}°C
          </div>
        </div>
      </div>
      <div className="weather-details">
        <div>체감 온도: {weatherData.feelsLike}°C</div>
        <div>습도: {weatherData.humidity}%</div>
        <div>날씨: {weatherData.weatherDescription}</div>
      </div>
      <div className="air-quality">
        미세먼지: {weatherData.pm10Category} ({weatherData.pm10}) | 초미세먼지:{' '}
        {weatherData.pm2_5Category} ({weatherData.pm2_5})
      </div>
    </div>
  );
};

export default Weather;
