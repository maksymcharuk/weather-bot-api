import { Injectable } from '@nestjs/common';
import { ClientOptions, OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/src/resources/chat/completions';
import { BASE_PROMPT } from '../prompts/base.prompt';

export interface AnalyzedResponse {
  clarificationNeeded: boolean;
  location: string;
  date: string;
}

@Injectable()
export class LLMService {
  private openai: OpenAI;

  constructor() {
    const configuration: ClientOptions = {
      apiKey: process.env.OPENAI_API_KEY,
    };
    this.openai = new OpenAI(configuration);
  }

  async generateResponse(
    messageParams: ChatCompletionMessageParam[] = [],
  ): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: BASE_PROMPT,
        },
        ...messageParams,
      ],
    });

    return response.choices[0].message.content || '';
  }
}
