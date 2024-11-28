import { ConversationHistory } from '../types/userContext.types';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserContext {
  @PrimaryColumn()
  userId: string;

  @Column('json', { default: [] })
  conversationHistory: ConversationHistory[];

  @Column('json', { default: [] })
  memories: string[];
}
