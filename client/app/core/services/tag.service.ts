import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { searchString } from '../utils/query-string';



@Injectable({
  providedIn: 'root'
})
export class TagService {
  constructor(
    private apiService: ApiService
  ) {}

  searchTags(term: string): Observable<any> {
    return this.apiService.get(`/tags/search${searchString(term)}`);
  }


}
