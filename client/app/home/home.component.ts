import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiResponse } from '../core/models/api-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '../core/models/pagination.model';
import { User } from '../core/models/user.model';
import { Post } from '../core/models/post.model';
import { PostService } from '../core/services/post.service';
import { UserService } from '../core/services/user.service';
import { Subscription } from 'rxjs';
import { concatMap, tap, delay, catchError } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  me: User;
  meSubscription: Subscription;

  posts: Post[] = [];
  postsLoading = false;
  postsPagination: Pagination = { limit: 5, offset: 0, count: 0, table: 'Posts' };
  postsSubscription: Subscription;

  users: User[] = [];
  usersLoading = false;
  usersScrollable = false;
  usersPagination: Pagination = { limit: 5, offset: 0, count: 0, table: 'Users' };
  usersSubscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private userService: UserService,
    private authService: AuthService
  ) {}
  ngOnInit() {

    this.subscribeMe();

    this.route.data
    .pipe(
      concatMap((response: { data: ApiResponse }) => {

        this.postsPagination.count = response.data.count;
        this.posts = response.data.data;
        this.usersPagination.limit = response.data.count ? 5 : 15;
        this.usersScrollable = response.data.count ? false : true;

        return this.userService.getUsersSuggested(this.usersPagination)
        .pipe(
          tap((users: ApiResponse) => {

            this.users = users.data;
            this.usersPagination.count = users.count;

          })
        );
      })
    ).subscribe();



  }
  private unsubscribePosts() {
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }
  private unsubscribeUsers() {
    if (this.usersSubscription) {
      this.usersSubscription.unsubscribe();
    }
  }



  ngOnDestroy() {
    this.unsubscribePosts();
    this.unsubscribeUsers();
    this.unsubscribeMe();
  }

  private loadPosts() {
    this.postsLoading = true;
    this.postsSubscription = this.postService.getPostsFollowing(this.postsPagination)
    .pipe(
      delay(300),
      catchError((error) => { this.router.navigateByUrl('/login'); return error; })
    )
    .subscribe((posts: ApiResponse) => {
      this.postsLoading = false;
      posts.data.forEach((post: Post) => {
        this.posts.push(post);
      });
    });
  }
  private loadUsers() {
    this.usersLoading = true;
    this.usersSubscription = this.userService.getUsersSuggested(this.usersPagination)
      .pipe(
        delay(300),
        catchError((error) => { this.router.navigateByUrl('/login'); return error; })
      )
      .subscribe((users: ApiResponse) => {
        this.usersLoading = false;
        users.data.forEach((user: Post) => {
          this.users.push(user);
        });
      });
  }
  onLoadUsers() {

    if (!this.usersScrollable) {
      return;
    }
    if (this.usersLoading) {
      return;
    }
    if (this.hasNext(this.usersPagination)) {

      this.setNext(this.usersPagination);
      this.loadUsers();
    }
  }
  private hasNext(pagination: Pagination): boolean {
    const next = pagination.limit + pagination.offset;
    return next < pagination.count;
  }
  private setNext(pagination: Pagination) {
    const next = pagination.limit + pagination.offset;
    pagination.offset = next;
  }

  onLoadPosts() {
    if (this.postsLoading) {
      return;
    }
    if (this.hasNext(this.postsPagination)) {
      this.setNext(this.postsPagination);
      this.loadPosts();
    }
  }


  getSideSectionClass(): string {
    const className = !this.postsPagination.count ? 'clr-col-xs-12 clr-col-sm-10 clr-offset-sm-1 clr-col-md-8 clr-offset-md-2'
    : 'clr-col-xs-12 clr-col-sm-10 clr-offset-sm-1 clr-col-md-6 clr-offset-md-0 clr-col-lg-5';

    return className;
  }

  hasUsers(): boolean {
    return this.users.length > 0;
  }

  onProfile() {
    this.router.navigateByUrl(`/profile/${this.me.id}`);
  }

  private subscribeMe() {
    this.meSubscription = this.authService.user.subscribe(
      (me) => {
        this.me = me;
      }
    );
  }

  private unsubscribeMe() {
    if (this.meSubscription) {
      this.meSubscription.unsubscribe();
    }
  }

}
