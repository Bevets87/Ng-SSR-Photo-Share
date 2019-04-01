import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Post } from '../core/models/post.model';
import { PostService } from '../core/services/post.service';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class PostDetailDataResolver implements Resolve<Post> {
  constructor(
    private postService: PostService,
    private router: Router,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = route.params['id'];
    const POST_DETAIL = makeStateKey(`post_detail-${id}`);

    if (this.transferState.hasKey(POST_DETAIL)) {
      const post = this.transferState.get(POST_DETAIL, null);
      this.transferState.remove(POST_DETAIL);


      return of(post);

    } else {
      return this.postService.getPostById(id).pipe(
        tap((post) => {

          if (isPlatformServer(this.platformId)) {

            this.transferState.set(POST_DETAIL, post);
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
