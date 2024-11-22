import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContext } from '../entities/userContext.entity';
import {
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
    return this.userContextRepository.findOne({
      where: { userId },
    });
  }

  async creteUserContext(
    userContext: CreateUserContextDto,
  ): Promise<UserContext> {
    const context = this.userContextRepository.create(userContext);
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
}
