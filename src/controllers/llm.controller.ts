import { Controller, Get, Put, Body, Param, Post } from '@nestjs/common';
import { UserContextService } from '../services/userContext.service';
import { LLMService } from '../services/llm.service';
import { WeatherService } from 'src/services/weather.service';

@Controller('llm')
export class LLMController {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly userContextService: UserContextService,
    private readonly llmService: LLMService,
  ) {}

  @Post('generate-response')
  async generateResponse(
    @Body() { userId, message }: { userId: string; message: string },
  ): Promise<string> {
    let context = await this.userContextService.getUserContext(userId);

    if (!context) {
      context = await this.userContextService.creteUserContext({ userId });
    }

    let response;
    const { clarificationNeeded, location, date } =
      await this.llmService.analyzeMessage(message, context);

    if (clarificationNeeded) {
      response = await this.llmService.generateResponse(
        `Check context and user's message and if needed ask user for clarification to get the necessary information. It can be about location, date, or other information\n
        ${context ? `Previous context: ${context}` : ''}\n 
        User message: ${message}`,
      );
    } else if (location) {
      let weatherData;
      try {
        if (date) {
          weatherData = await this.weatherService.getHistoryWeather(
            location,
            new Date(date),
          );
        } else {
          weatherData = await this.weatherService.getCurrentWeather(location);
        }
      } catch (error) {
        return await this.llmService.generateResponse(
          `Error fetching weather data for location: ${location} and date: ${date}. 
          Date must be not in the past and not later than 14 days from today. 
          Today is ${new Date().toDateString()}.:
          `,
        );
      }

      response = await this.llmService.generateResponse(`
        Check context, message and weather data in JSON and provide human-friendly response to the user\n
        Weather data JSON string: ${JSON.stringify(weatherData)}, where
        "temp_c" is the temperature in Celsius,
        "condition" is a JSON object with the weather conditions,
        and other fields are self-explanatory.
        Message: ${message},
        Context: ${context ? `Previous context: ${context}` : 'no context'}
      `);
    }

    // Append user message to conversation history
    context.conversationHistory.push({ role: 'user', content: message });

    // Load user context from API server
    await this.userContextService.updateUserContext({ userId, data: context });

    return response;
  }
}
