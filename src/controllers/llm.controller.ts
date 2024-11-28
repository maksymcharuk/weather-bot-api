import { Controller, Body, Post, Get, Param, Query } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';
import { UserContextService } from '../services/userContext.service';
import { LLMService } from '../services/llm.service';
import { WeatherService } from '../services/weather.service';
import {
  CallServiceRequest,
  DelegatorService,
} from '../services/delegator.service';
import { Weather, WeatherHistory } from '../types/weather.types';

@Controller('llm')
export class LLMController {
  constructor(
    private readonly userContextService: UserContextService,
    private readonly llmService: LLMService,
    private readonly delegatorService: DelegatorService,
  ) {}

  @Post('generate-response')
  async generateResponse(
    @Body() { userId, message }: { userId: string; message: string },
  ): Promise<string> {
    let context = await this.userContextService.getUserContext(userId);
    let maxProcessOperations = 5;

    const basicMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `
          Current date: ${new Date().toDateString()},
          User ID: ${userId},
          Conversation history: ${context.conversationHistory
            .slice(-5)
            .map((item) => `${item.role}: ${item.content}`)
            .join(', ')},
          Memories: ${context.memories.join(', ')},
        `,
      },
      {
        role: 'user',
        content: message,
      },
    ];

    let initialResponse = await this.llmService.generateResponse([
      ...basicMessages,
    ]);

    const processResponse = async (response: string): Promise<string> => {
      try {
        maxProcessOperations--;

        if (maxProcessOperations <= 0) {
          return this.llmService.generateResponse([
            ...basicMessages,
            {
              role: 'system',
              content: `
                Max process operations reached.
              `,
            },
          ]);
        }

        const apiRequests: CallServiceRequest[] = JSON.parse(response);
        const apiResponses: Array<{ service: string; response: any }> = [];

        try {
          for (const apiRequest of apiRequests) {
            const response = await this.delegatorService.callService(
              apiRequest.service,
              apiRequest.method,
              apiRequest.data,
            );

            apiResponses.push({
              service: apiRequest.service,
              response,
            });
          }

          response = await this.llmService.generateResponse([
            ...basicMessages,
            {
              role: 'system',
              content: `
                Recived response: ${JSON.stringify(apiResponses)}.
              `,
            },
          ]);

          return processResponse(response);
        } catch (error) {
          console.error('Error calling services', error);

          return this.llmService.generateResponse([
            ...basicMessages,
            {
              role: 'system',
              content: `
                Error calling services: ${error.message}.
              `,
            },
          ]);
        }
      } catch (error) {
        return response;
      }
    };

    const finalResponse = await processResponse(initialResponse);

    await this.userContextService.addConversationHistory({
      userId,
      conversationHistory: [
        {
          role: 'user',
          content: message,
        },
        {
          role: 'system',
          content: finalResponse,
        },
      ],
    });

    return finalResponse;
  }
}
