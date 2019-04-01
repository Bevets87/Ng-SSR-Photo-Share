import { Injectable } from '@angular/core';
import { paginationString } from '../utils/query-string';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Pagination } from '../models/pagination.model';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor (
    private apiService: ApiService
  ) {}
  getMyPosts(p: Pagination): Observable<ApiResponse> {
    return this.apiService.get(`/me/posts${paginationString(p)}`);
  }
  getPostsFollowing({ limit, offset }: Pagination): Observable<ApiResponse>  {
    return this.apiService.get(`/me/posts/following${paginationString({ limit, offset })}`);
  }
  getPostsSuggested({ limit, offset }: Pagination): Observable<ApiResponse> {
    return this.apiService.get(`/me/posts/suggested${paginationString({ limit, offset })}`);
  }
  getPostById(id: number): Observable<Post> {
    return this.apiService.get(`/posts/${id}`);
  }
  getPostComments(id: number, { limit, offset }: Pagination): Observable<ApiResponse> {
    return this.apiService.get(`/posts/${id}/comments${paginationString({ limit, offset })}`);
  }
  createPostComment(id: number, comment_text: string): Observable<Comment> {
    return this.apiService.post(`/posts/${id}/comments`, { comment_text });
  }
  createPostLike(id: number): Observable<any> {
    return this.apiService.post(`/posts/${id}/likes`);
  }
  deletePostLike(id: number): Observable<any> {
    return this.apiService.delete(`/me/likes/${id}`);
  }
  deletePost(id: number): Observable<any> {
    return this.apiService.delete(`/me/posts/${id}`);
  }
  getPostsByTagId(id: number, { limit, offset }: Pagination): Observable<any> {
    return this.apiService.get(`/posts/tags/${id}${paginationString({ limit, offset })}`);
  }

  createPost(payload): Observable<any> {
    return this.apiService.post('/posts', payload);
  }


}
