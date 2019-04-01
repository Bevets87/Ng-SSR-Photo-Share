import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../../core/models/post.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.scss']
})
export class PostHeaderComponent {
  @Input() post: Post;
  @Input() followable: boolean;
  @Output() follow = new EventEmitter<boolean>();
  constructor(
    private router: Router
  ) {}
  onFollow() {
    this.post.is_followee = true;
    this.follow.emit(true);
  }
  onUnfollow() {
    this.post.is_followee = false;
    this.follow.emit(false);
  }
  onClick() {
    this.router.navigateByUrl(`/profile/${this.post.user_id}`);
  }
}
