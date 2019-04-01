import { Injectable } from '@angular/core';
import { UserService } from '../services/user.service';
import { TagService } from '../services/tag.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(
    private tagService: TagService,
    private userService: UserService
  ) {}

  search(term: string): Observable<any> {
    if (this.isHashTerm(term) && this.isHashLength(term)) {
      return this.tagService.searchTags(term.slice(1, term.length))
      .pipe(
        map((tags) => tags.map(tag => ({
          icon: null,
          title: `#${tag.tag_name}`,
          info: `${tag.posts} posts`,
          id: tag.id,
          type: 'tag'
        })))
      );
    } else if (!this.isHashTerm(term)) {
      return this.userService.searchUsers(term)
      .pipe(
        map((users) => users.map(user => ({
          icon: user.avatar,
          title: user.username,
          info: null,
          id: user.id,
          type: 'user'
        })))
      );
    } else {
      return of([]);
    }
  }
  private isHashTerm(term: string): boolean {
    return term.charAt(0) === '#';
  }

  private isHashLength(term: string): boolean {
    return term.length > 1;
  }


}
