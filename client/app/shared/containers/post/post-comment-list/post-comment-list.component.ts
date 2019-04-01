import { Component, Input } from '@angular/core';
import { Post } from '../../../../core/models/post.model';

@Component({
  selector: 'app-post-comment-list',
  templateUrl: './post-comment-list.component.html',
  styleUrls: ['./post-comment-list.component.scss']
})
export class PostCommentListComponent {
  @Input() loading: boolean;
  @Input() post: Post;
  constructor() {}

}
