import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Pagination } from '../../../../core/models/pagination.model';
import { Post } from '../../../../core/models/post.model';


@Component({
  selector: 'app-post-footer',
  templateUrl: './post-footer-component.html',
  styleUrls: ['./post-footer.component.scss']
})
export class PostFooterComponent implements OnInit {
  @Input() pagination: Pagination;
  @Input() post: Post;
  @Input() username: string;
  @Output() enterComment = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<Pagination>();
  comment = '';
  constructor() {}
  ngOnInit() {}
  onEnterComment() {
    const comment = this.comment;
    if (this.post.comments.data.length === this.pagination.limit) {
      this.post.comments.data.pop();
    }
    this.post.comments.data.unshift({ comment_text: comment, username: this.username });
    this.comment = '';
    ++this.pagination.count;
    this.enterComment.emit(comment);
  }
  onPageChange(pagination: Pagination) {
    this.pageChange.emit(pagination);
  }

}


