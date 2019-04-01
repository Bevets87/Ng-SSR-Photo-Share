import { Component, Input } from '@angular/core';
import { Post } from '../../../../core/models/post.model';

@Component({
  selector: 'app-post-photo',
  templateUrl: './post-photo.component.html',
  styleUrls: ['./post-photo.component.scss']
})
export class PostPhotoComponent {
  @Input() post: Post;
  constructor() {}
  onError() {
    this.post.image_url = 'https://www.fillmurray.com/350/225';
  }
}
