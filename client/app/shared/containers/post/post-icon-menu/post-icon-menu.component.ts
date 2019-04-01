import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../../../../core/models/post.model';
import { Tag } from '../../../../core/models/tag.model';
import { Router } from '@angular/router';



@Component({
  selector: 'app-post-icon-menu',
  templateUrl: './post-icon-menu.component.html',
  styleUrls: ['./post-icon-menu.component.scss']
})
export class PostIconMenuComponent {
  @Input() post: Post;
  @Output() like = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) {}
  getTagNames(): Tag[] {
    return this.post.tags;
  }
  hasTags() {
    return this.post.tags.length > 0;
  }
  onToggleLike() {
    this.post.me_likes = !this.post.me_likes;
    if (this.post.me_likes) {
      this.post.likes++;
    } else {
      this.post.likes--;
    }
    this.like.emit(this.post.me_likes);
  }
  onClickTag(tag) {
    this.router.navigateByUrl(`/tags/${tag.id}`);
  }

}
