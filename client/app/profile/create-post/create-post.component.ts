import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { PostService } from '../../core/services/post.service';
import { Router } from '@angular/router';
import { Photo } from '../../core/models/photo.model';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  @Input() open: boolean;
  @Output() close = new EventEmitter<null>();
  @Output() created = new EventEmitter<Photo>();
  image_url: string;
  tags: string;
  error: string;
  constructor(
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.initInputs();
  }

  onClose() {
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  initInputs() {
    this.image_url = '';
    this.tags = '';
  }

  onSave() {
    if (this.image_url) {
      const tag_names = this.tags.split(',')
      .filter(s => s.length > 0)
      .map(s => s.trim())
      .map(s => s.toLocaleLowerCase());

      this.postService.createPost({
        image_url: this.image_url,
        tag_names
      }).toPromise()
      .then((response) => {

        this.created.emit(response);
        this.close.emit();
        this.initInputs();
      })
      .catch((response) => {

        this.error = response.error.sqlMessage ? response.error.sqlMessage : response.error.message;
      });

    }



  }




}
