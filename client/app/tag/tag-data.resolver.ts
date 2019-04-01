import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiResponse } from '../core/models/api-response.model';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PostService } from '../core/services/post.service';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class TagDataResolver implements Resolve<ApiResponse> {
  constructor(
    private router: Router,
    private postService: PostService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApiResponse> {
    const id = route.params['id'];
    const TAGGED_POSTS = makeStateKey<ApiResponse>(`tagged_posts-${id}`);
    if (this.transferState.hasKey(TAGGED_POSTS)) {
      const posts = this.transferState.get(TAGGED_POSTS, { tag: null, data: [], count: 0 });
      this.transferState.remove(TAGGED_POSTS);

      return of(posts);
    } else {
      return this.postService.getPostsByTagId(id, { limit: 9, offset: 0 })
        .pipe(
          tap((response) => {

            if (isPlatformServer(this.platformId)) {
              this.transferState.set(TAGGED_POSTS, response);
            }
          }),
          catchError((error) => {
            console.error(error);
            this.router.navigateByUrl('/');
            return of(error);
          })

        );
    }


  }
}
