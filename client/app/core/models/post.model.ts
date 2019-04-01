import { Comment } from './comment.model';
import { Tag } from './tag.model';

export interface Post {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  comments: { data: Comment[], count: number };
  likes: number;
  tags: Tag[];
  image_url: string;
  me_likes: boolean;
  is_followee: boolean;
  is_me: boolean;
}
