import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiResponse } from '../core/models/api-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../core/services/post.service';
import { Pagination } from '../core/models/pagination.model';
import { Photo } from '../core/models/photo.model';
import { catchError, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit, OnDestroy  {


  photo: Photo;

  photos: Photo[];
  photosLoading = false;
  photosSubscription: Subscription;
  photosPagination: Pagination = { limit: 9, offset: 0, count: 0, table: 'Photos' };



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) { }
  ngOnInit() {

    this.route.data.subscribe(
      (response: { data: ApiResponse }) => {

        if (!response.data.count) {
          this.router.navigateByUrl('/');
        }
        this.photosPagination.count = response.data.count;
        this.photos = response.data.data;
      }
    );

  }
  unsubscribePhotos() {
    if (this.photosSubscription) {
      this.photosSubscription.unsubscribe();
    }
  }

  ngOnDestroy() {
   this.unsubscribePhotos();


  }
  private loadPhotos() {
    this.unsubscribePhotos();
    this.photosLoading = true;
    this.photosSubscription = this.postService.getPostsSuggested(this.photosPagination)
    .pipe(
      delay(300),
      catchError((error) => {
        this.router.navigateByUrl('/login');
        return error;
      })
    )
    .subscribe((photos: ApiResponse) => {
      this.photosLoading = false;
      photos.data.forEach((photo: Photo) => {
        this.photos.push(photo);
      });
    });
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
