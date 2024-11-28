import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { LLMController } from './controllers/llm.controller';

import { WeatherService } from './services/weather.service';
import { UserContextService } from './services/userContext.service';
import { LLMService } from './services/llm.service';
import { DelegatorService } from './services/delegator.service';

import { UserContext } from './entities/userContext.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserContext],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserContext]),
  ],
  controllers: [LLMController],
  providers: [WeatherService, UserContextService, LLMService, DelegatorService],
})
export class AppModule {}
