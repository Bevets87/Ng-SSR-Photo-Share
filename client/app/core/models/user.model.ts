export interface User {
  id: number;
  username: string;
  avatar?: string;
  is_followee?: boolean;
  is_follower?: boolean;
  is_me?: boolean;
}


