import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { LLMController } from './controllers/llm.controller';

import { AppService } from './app.service';
import { WeatherService } from './services/weather.service';
import { UserContextService } from './services/userContext.service';
import { LLMService } from './services/llm.service';

import { UserContext } from './entities/userContext.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'weather_bot',
      entities: [UserContext],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserContext]),
  ],
  controllers: [AppController, LLMController],
  providers: [AppService, WeatherService, UserContextService, LLMService],
})
export class AppModule {}
