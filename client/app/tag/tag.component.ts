import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Photo } from '../core/models/photo.model';
import { Pagination } from '../core/models/pagination.model';
import { Subscription } from 'rxjs';
import { Tag } from '../core/models/tag.model';
import { PostService } from '../core/services/post.service';


@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit, OnDestroy {
  tag: Tag;

  photos: Photo[];
  photosPagination: Pagination = { limit: 9, offset: 0, count: 0, table: 'Photos' };
  photosLoading: boolean;
  photosSubscription: Subscription;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(
      (response: { data: any }) => {
        this.tag = response.data.tag;
        this.photos = response.data.posts.data;
        this.photosPagination.count = response.data.posts.count;

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
        this.photosLoading = false;
        this.photos = response.posts.data;
        this.photosPagination.count = response.posts.count;
        this.tag = response.tag;
      }
    );
  }

  private hasNext(pagination: Pagination): boolean {
    const next = pagination.limit + pagination.offset;
    return next < pagination.count;
  }
  private setNext(pagination: Pagination) {
    const next = pagination.limit + pagination.offset;
    pagination.offset = next;
  }
  onLoadPhotos() {
    if (this.photosLoading) {
      return;
    }
    if (this.hasNext(this.photosPagination)) {
      this.setNext(this.photosPagination);
      this.loadPhotos();
    }
  }










}
