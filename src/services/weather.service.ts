import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Weather, WeatherWithForecast } from 'src/types/weather.types';

@Injectable()
export class WeatherService {
  apiKey = process.env.WEATHER_API_KEY;
  apiBaseUrl = 'https://api.weatherapi.com/v1/history.json';

  async getWeatherData(
    location: string,
    date: Date,
  ): Promise<WeatherWithForecast>;

  async getWeatherData(location: string, date?: Date): Promise<Weather> {
    const formattedDate = date.toISOString().split('T')[0];
    let response;

    try {
      response = await axios.get(this.apiBaseUrl, {
        params: {
          key: this.apiKey,
          q: location,
          dt: formattedDate,
        },
      });
    } catch (error) {
      throw new Error('Error fetching weather data');
    }

    return response.data;
  }
}
