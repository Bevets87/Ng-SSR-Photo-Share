import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiResponse } from '../core/models/api-response.model';
import { PostService } from '../core/services/post.service';
import { Observable, of } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { tap, catchError } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class HomeDataResolver implements Resolve<ApiResponse> {
  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    private transferState: TransferState,
    private postService: PostService
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponse> {
    const POSTS_FOLLOWING = makeStateKey<ApiResponse>('posts_following');

    if (this.transferState.hasKey(POSTS_FOLLOWING)) {
      const posts = this.transferState.get(POSTS_FOLLOWING, { data: [], count: 0 });
      this.transferState.remove(POSTS_FOLLOWING);

      return of(posts);
    } else {
      return this.postService.getPostsFollowing({ limit: 5, offset: 0 })
      .pipe(
        tap((posts) => {

          if (isPlatformServer(this.platformId)) {


            this.transferState.set(POSTS_FOLLOWING, posts);
          }
        }),
        catchError((error) => {
          console.error(error);
          return of(error);
        })
      );
    }

  }

}
