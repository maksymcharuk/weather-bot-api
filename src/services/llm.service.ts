import { Injectable } from '@nestjs/common';
import { ClientOptions, OpenAI } from 'openai';
import { UserContext } from '../entities/userContext.entity';

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

  async generateResponse(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful weather forecast assistant.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return response.choices[0].message.content || '';
  }

  async analyzeMessage(
    prompt: string,
    context: UserContext,
  ): Promise<AnalyzedResponse> {
    // Custom logic to ask the LLM if clarification is required
    const clarificationPrompt = `
      Does this message need clarification for location, date, or other information?\nMessage: "${prompt}"\n
      Please provide JSON { clarificationNeeded: boolean, location: string, date: string } without any formating and other symbols, where:
      1. clarificationNeeded: true if clarification is needed, false otherwise
      2. location: the location mentioned in the message or in the context
      3. date: the date mentioned in the message or in the context in format "YYYY-MM-DD", if date is not mentioned, provide the current date.
      Which is ${new Date().toDateString()} \n
      Also consider the context: ${JSON.stringify(context)}
    `;
    const response = await this.generateResponse(clarificationPrompt);
    console.log('Clarification response:', response);

    return JSON.parse(response);
  }
}
