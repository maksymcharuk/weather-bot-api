import { Injectable } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { UserContextService } from './userContext.service';

export interface CallServiceRequest {
  service: string;
  method: string;
  data: any;
}

@Injectable()
export class DelegatorService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly userContextService: UserContextService,
  ) {}

  callService(service: string, method: string, data: any): Promise<any> {
    switch (service) {
      case 'weatherService':
        return this.weatherService[method](data);
      case 'userContextService':
        return this.userContextService[method](data);
      default:
        throw new Error('Service not found');
    }
  }
}
