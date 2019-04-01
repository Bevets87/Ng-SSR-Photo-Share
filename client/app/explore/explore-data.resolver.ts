import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApiResponse } from '../core/models/api-response.model';
import { PostService } from '../core/services/post.service';
import { Observable, of } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class ExploreDataResolver implements Resolve<ApiResponse> {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private transferState: TransferState,
    private postService: PostService
  ) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponse> {
    const POSTS_SUGGESTED = makeStateKey<ApiResponse>('posts_suggested');

    if (this.transferState.hasKey(POSTS_SUGGESTED)) {
      const posts = this.transferState.get(POSTS_SUGGESTED, { data: [], count: 0 });
      this.transferState.remove(POSTS_SUGGESTED);
      return of(posts);
    } else {
      return this.postService.getPostsSuggested({ limit: 9, offset: 0 })
      .pipe(
        tap((posts) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(POSTS_SUGGESTED, posts);
          }
        }),
        catchError(error => {
          console.error(error);
          return of(error);
        })
      );
    }


  }

}
