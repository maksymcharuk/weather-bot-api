import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Weather, WeatherHistory } from '../types/weather.types';

@Injectable()
export class WeatherService {
  private readonly weatherApi = axios.create({
    baseURL: 'https://api.weatherapi.com/v1/',
    params: {
      key: process.env.WEATHER_API_KEY,
    },
  });

  async getCurrentWeather(location: string): Promise<Weather> {
    let response;

    try {
      response = await this.weatherApi.get('current.json', {
        params: {
          q: location,
        },
      });
    } catch (error) {
      console.error('Error fetching weather data', error);
      throw new Error('Error fetching weather data');
    }

    return response.data;
  }

  async getHistoryWeather(
    location: string,
    date: Date,
  ): Promise<WeatherHistory> {
    let response;

    try {
      response = await this.weatherApi.get('history.json', {
        params: {
          q: location,
          dt: date.toISOString().split('T')[0],
        },
      });
    } catch (error) {
      console.error('Error fetching weather data', error);
      throw new Error('Error fetching weather data');
    }

    return response.data;
  }
}
