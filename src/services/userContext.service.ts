import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContext } from '../entities/userContext.entity';

@Injectable()
export class UserContextService {
  constructor(
    @InjectRepository(UserContext)
    private userContextRepository: Repository<UserContext>,
  ) {}

  async getUserContext(userId: string): Promise<UserContext> {
    const context = await this.userContextRepository.findOne({
      where: { userId },
    });
    return context || { userId, location: null, conversationHistory: [] };
  }

  async updateUserContext(
    userId: string,
    data: Partial<UserContext>,
  ): Promise<UserContext> {
    const context = await this.userContextRepository.findOne({
      where: { userId },
    });

    if (context) {
      // Update existing record
      context.location = data.location || context.location;
      context.conversationHistory =
        data.conversationHistory || context.conversationHistory;
      return this.userContextRepository.save(context);
    } else {
      // Create new record
      const newContext = this.userContextRepository.create({ userId, ...data });
      return this.userContextRepository.save(newContext);
    }
  }
}
