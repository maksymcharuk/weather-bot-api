import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContext } from '../entities/userContext.entity';
import {
  AddConversationHistoryDto,
  CreateUserContextDto,
  UpdateUserContextDto,
} from '../dtos/userContext.dtos';

@Injectable()
export class UserContextService {
  constructor(
    @InjectRepository(UserContext)
    private userContextRepository: Repository<UserContext>,
  ) {}

  async getUserContext(userId: string): Promise<UserContext> {
    let context = await this.userContextRepository.findOne({
      where: { userId },
    });
    if (!context) {
      context = await this.creteUserContext({ userId });
    }
    return context;
  }

  async creteUserContext(
    userContext: CreateUserContextDto,
  ): Promise<UserContext> {
    const context = this.userContextRepository.create(userContext);
    return this.userContextRepository.save(context);
  }

  async updateUserMemories(data: {
    userId: string;
    memories: string[];
  }): Promise<UserContext> {
    const context = await this.getUserContext(data.userId);
    context.memories = data.memories;
    return this.userContextRepository.save(context);
  }

  async updateUserContext(
    userContext: UpdateUserContextDto,
  ): Promise<UserContext> {
    await this.userContextRepository.update(
      { userId: userContext.userId },
      userContext.data,
    );
    return this.getUserContext(userContext.userId);
  }

  async addConversationHistory(data: AddConversationHistoryDto) {
    const context = await this.getUserContext(data.userId);
    context.conversationHistory = [
      ...context.conversationHistory,
      ...data.conversationHistory,
    ];
    return this.userContextRepository.save(context);
  }
}
