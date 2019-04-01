export interface Photo {
  id: number;
  user_id: number;
  username: string;
  avatar?: string;
  image_url: string;
  comments: number;
  likes: number;

}
