import { UserContext } from '../entities/userContext.entity';

export interface CreateUserContextDto {
  userId: string;
}

export interface UpdateUserContextDto {
  userId: string;
  data: Partial<UserContext>;
}
