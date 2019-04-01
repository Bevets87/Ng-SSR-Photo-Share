import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { Pagination } from '../../../core/models/pagination.model';
import { ApiResponse } from '../../../core/models/api-response.model';
import { PostService } from '../../../core/services/post.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';



@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: Post;
  @Input() followable: boolean;

  commentsSubscription: Subscription;
  commentsPagination: Pagination = { limit: 5, offset: 0, count: 0, table: 'Comments' };
  commentsLoading = false;


  meSubscription: Subscription;
  me: User;

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private userService: UserService
  ) { }
  ngOnInit() {

    this.commentsPagination.count = this.post.comments.count;
    this.meSubscription = this.authService.user.subscribe((user: User) => {
      this.me = user;
    });


  }
  unsubscribeComments() {
    if (this.commentsSubscription) {
      this.commentsSubscription.unsubscribe();
    }
  }
  unsubscribeMe() {
    if (this.meSubscription) {
      this.meSubscription.unsubscribe();
    }
  }
  ngOnDestroy() {
    this.unsubscribeComments();
    this.unsubscribeMe();
  }
  loadComments() {
    this.unsubscribeComments();
    this.commentsLoading = true;
    this.commentsSubscription = this.postService.getPostComments(this.post.id, this.commentsPagination)
      .pipe(
        delay(300)
      ).subscribe((comments: ApiResponse) => {
        this.commentsLoading = false;
        this.post.comments = comments;
      });
  }
  onPageChange(pagination: Pagination) {

    this.commentsPagination.offset = pagination.offset;
    this.loadComments();
  }
  onEnterComment(comment_text: string) {
    this.postService.createPostComment(this.post.id, comment_text).toPromise();
  }
  onLike(me_likes: boolean) {
    if (me_likes) {
      this.postService.createPostLike(this.post.id)
      .toPromise();
    } else {

      this.postService.deletePostLike(this.post.id)
      .toPromise();
    }
  }

  onFollow(is_followee: boolean) {
    if (is_followee) {
      this.userService.followUser(this.post.user_id)
      .toPromise();
    } else {
      this.userService.unfollowUser(this.post.user_id)
      .toPromise();
    }
  }


}
