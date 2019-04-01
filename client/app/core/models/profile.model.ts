import { Photo } from './photo.model';

export interface Profile {
  following: number;
  followers: number;
  photos: { data: Photo[], count: number };
  is_me: boolean;
  is_followee: boolean;
  id: number;
  username: string;
  avatar?: string;
}
