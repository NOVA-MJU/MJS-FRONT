export interface WeatherInfo {
  id: number;
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  weatherMain: string;
  weatherDescription: string;
  weatherIcon: string;
  minTemperature: number;
  maxTemperature: number;
  pm10: number;
  pm10Category: string;
  pm2_5: number;
  pm2_5Category: string;
  timestamp: string;
}
