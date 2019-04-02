import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../core/models/photo.model';
import { Pagination } from '../core/models/pagination.model';
import { Subscription } from 'rxjs';
import { Tag } from '../core/models/tag.model';
import { PostService } from '../core/services/post.service';
import { ApiResponse } from '../core/models/api-response.model';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {
  tag: Tag;

  photos: Photo[] = [];
  photosPagination: Pagination = { limit: 9, offset: 0, count: 0, table: 'Photos' };
  photosLoading = true;
  photosSubscription: Subscription;



  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) { }

  ngOnInit() {

    this.route.data.subscribe(
      (response: { data: { tag: Tag, posts: ApiResponse } }) => {

        this.tag = response.data.tag;
        this.photosLoading = false;
        this.photosPagination.offset = 0;
        this.photosPagination.count = response.data.posts.count;
        this.photos = response.data.posts.data;

      }
    );

  }


  ngOnDestroy() {
    this.unsubscribePhotos();
  }
  unsubscribePhotos() {
    if (this.photosSubscription) {
      this.photosSubscription.unsubscribe();
    }
  }

  loadPhotos() {
    this.unsubscribePhotos();
    this.photosLoading = true;
    this.photosSubscription = this.postService.getPostsByTagId(this.tag.id, this.photosPagination)
    .subscribe(
      (response) => {
        this.tag = response.tag;
        this.photosLoading = false;
        this.photosPagination.count = response.posts.count;
        response.posts.data.forEach(photo => {
          this.photos.push(photo);
        });

      }
    );
  }

  private hasNext(): boolean {
    const next = this.photosPagination.limit + this.photosPagination.offset;
    return next < this.photosPagination.count;
  }
  private setNext() {
    const next = this.photosPagination.limit + this.photosPagination.offset;
    this.photosPagination.offset = next;
  }
  onLoadPhotos() {

    if (this.photosLoading) {
      return;
    }

    if (this.hasNext()) {
      this.setNext();
      this.loadPhotos();
    }
  }










}
