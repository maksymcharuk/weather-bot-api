import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class UserContext {
  @PrimaryColumn()
  userId: string;

  @Column({ nullable: true })
  location: string;

  @Column('json', { default: [] })
  conversationHistory: { role: string; content: string }[];
}
