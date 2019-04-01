import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Post } from '../../../core/models/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent {
  @Input() loading: boolean;
  @Input() posts: Post[];
  @Output() load = new EventEmitter<null>();
  constructor() {}
  onScrollBottom() {
    this.load.emit();
  }








}
