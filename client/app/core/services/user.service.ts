import { Injectable } from '@angular/core';
import { paginationString, searchString } from '../utils/query-string';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Pagination } from '../models/pagination.model';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private apiService: ApiService
  ) { }


  getUsersSuggested(p: Pagination): Observable<ApiResponse> {

    return this.apiService.get(`/me/users/suggested${paginationString(p)}`);
  }
  searchUsers(term: string): Observable<any> {
    return this.apiService.get(`/users/search${searchString(term)}`);
  }
  followUser(followee_id: number): Observable<any> {
    return this.apiService.post(`/me/following`, { followee_id });
  }
  unfollowUser(id: number): Observable<any> {
    return this.apiService.delete(`/me/following/${id}`);
  }
  getUserProfileById(id: number): Observable<Profile> {
    return this.apiService.get(`/users/profile/${id}`);
  }
  getUserProfileFollowing(id: number, p: Pagination): Observable<ApiResponse> {
    return this.apiService.get(`/users/profile/${id}/following${paginationString(p)}`);
  }

  getUserProfileFollowers(id: number, p: Pagination): Observable<ApiResponse> {

    return this.apiService.get(`/users/profile/${id}/followers${paginationString(p)}`);
  }
  updateMe(user): Observable<any> {
    return this.apiService.post('/me', user);
  }

  getMe() {
    return this.apiService.get('/me');
  }

  deleteMe(id: number) {
    return this.apiService.delete(`/me/${id}`);
  }

  changePassword(payload) {
    return this.apiService.post('/me/change-password', payload);
  }

}
