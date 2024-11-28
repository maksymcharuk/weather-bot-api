import { ConversationHistory } from '../types/userContext.types';
import { UserContext } from '../entities/userContext.entity';

export interface CreateUserContextDto {
  userId: string;
}

export interface UpdateUserContextDto {
  userId: string;
  data: Partial<UserContext>;
}

export interface AddConversationHistoryDto {
  userId: string;
  conversationHistory: ConversationHistory[];
}
