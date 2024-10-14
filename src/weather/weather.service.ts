import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

const configService = new ConfigService();

@Injectable()
export class WeatherService {
  async getWeather(city: string) {
    try {
      const response = await axios.get(
        `${configService.getOrThrow('OPEN_WEATHER_API_URL')}`,
        {
          params: {
            q: city,
            appid: configService.getOrThrow('OPEN_WEATHER_API_KEY'),
          },
        },
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 404:
            throw new HttpException('City not found.', HttpStatus.NOT_FOUND);
          case 429:
            throw new HttpException(
              'API rate limit exceeded. Please try again later.',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          case 401:
            throw new HttpException(
              'Invalid API key provided.',
              HttpStatus.UNAUTHORIZED,
            );
          case 500:
            throw new HttpException(
              'Server error from weather service.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          default:
            throw new HttpException(
              'An error occurred while fetching weather data.',
              statusCode,
            );
        }
      }
    }
  }
}
