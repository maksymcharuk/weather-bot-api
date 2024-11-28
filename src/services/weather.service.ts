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

  async getCurrentWeather(data: { location: string }): Promise<Weather> {
    let response;

    try {
      response = await this.weatherApi.get('current.json', {
        params: {
          q: data.location,
        },
      });
    } catch (error) {
      console.log('Error fetching weather data', error.response.data.error);
      throw new Error('Error fetching weather data');
    }

    return response.data;
  }

  // Between today and next 14 day
  async getForecastWeather(data: {
    location: string;
    date: Date | string;
  }): Promise<WeatherHistory> {
    let response;
    const date = new Date(data.date);

    try {
      response = await this.weatherApi.get('forecast.json', {
        params: {
          q: data.location,
          dt: date.toISOString().split('T')[0],
        },
      });
    } catch (error) {
      console.log('Error fetching weather data', error.response.data.error);
      throw new Error('Error fetching weather data');
    }

    return response.data;
  }

  // Between 14 days and 300 days from today in the future
  async getFutureWeather(data: {
    location: string;
    date: Date | string;
  }): Promise<WeatherHistory> {
    let response;
    const date = new Date(data.date);

    try {
      response = await this.weatherApi.get('future.json', {
        params: {
          q: data.location,
          dt: date.toISOString().split('T')[0],
        },
      });
    } catch (error) {
      console.log('Error fetching weather data', error.response.data.error);
      throw new Error('Error fetching weather data');
    }

    return response.data;
  }
}
