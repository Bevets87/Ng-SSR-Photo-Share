import { User } from './user.model';

export interface SessionResponse {
  authenticated: boolean;
  user: User;
}
