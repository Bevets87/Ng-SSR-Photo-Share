import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../core/models/profile.model';
import { Subscription } from 'rxjs';
import { Photo } from '../core/models/photo.model';
import { Pagination } from '../core/models/pagination.model';
import { PostService } from '../core/services/post.service';
import { UserService } from '../core/services/user.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: Profile;
  profileSubscription: Subscription;

  meSubscription: Subscription;

  photos: Photo[] = [];
  photosSubscription: Subscription;
  photosPagination: Pagination = { limit: 9, offset: 0, count: 0, table: 'Photos' };
  photosLoading: boolean;

  changePasswordModal = false;
  editProfileModal = false;
  createPostModal = false;
  deleteAccountModal = false;
  followersModal = false;
  followingModal = false;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private router: Router
  ) { }
  subscribeData() {
    this.route.data.subscribe(
      (response: { data: Profile }) => {
        this.profile = response.data;
        this.photosPagination.offset = 0;
        this.photosPagination.count = response.data.photos.count;
        this.photos = response.data.photos.data;
      }
    );
  }

  loadPhotos() {
    this.unsubscribePhotos();
    this.photosLoading = true;
    this.photosSubscription = this.postService.getMyPosts(this.photosPagination)
    .subscribe(
      (photos) => {
        this.photosLoading = false;
        this.photosPagination.count = photos.count;

        photos.data.forEach(photo => {
          this.photos.push(photo);
        });
      }
    );
  }

  loadProfile() {
    this.unsubscribeProfile();
    this.profileSubscription = this.userService.getUserProfileById(this.profile.id)
    .subscribe(
      (profile) => {
        this.profile.followers = profile.followers;
        this.profile.following = profile.following;


      }
    );
  }

  loadMe() {
    this.unsubscribeMe();
    this.meSubscription = this.userService.getMe()
    .subscribe((user) => {
      this.profile.username = user.username;
      this.profile.avatar = user.avatar;
    });
  }

  unsubscribePhotos() {
    if (this.photosSubscription) {
      this.photosSubscription.unsubscribe();
    }
  }

  unsubscribeMe() {
    if (this.meSubscription) {
      this.meSubscription.unsubscribe();
    }
  }

  unsubscribeProfile() {
    if (this.profileSubscription) {
      this.profileSubscription.unsubscribe();
    }
  }

  ngOnInit() {

    this.subscribeData();
  }

  ngOnDestroy() {

    this.unsubscribePhotos();
    this.unsubscribeMe();
    this.unsubscribeProfile();

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

  onSelect(id: number) {

    this.router.navigateByUrl(`/p/${id}`);
  }
  onDelete(id: number) {
    this.photos = this.photos.filter(p => p.id !== id);
    this.photosPagination.count--;
    this.postService.deletePost(id).toPromise();





  }

  onShowChangePasswordModal() {
    this.changePasswordModal = true;
  }
  onCloseChangePasswordModal() {
    this.changePasswordModal = false;
  }

  onShowEditProfileModal() {
    this.editProfileModal = true;
  }

  onCloseEditProfileModal() {
    this.editProfileModal = false;
  }

  onShowCreatePostModal() {
    this.createPostModal = true;
  }

  onCloseCreatePostModal() {
    this.createPostModal = false;
  }

  onShowDeleteAccountModal() {
    this.deleteAccountModal = true;
  }

  onCloseDeleteAccountModal() {
    this.deleteAccountModal = false;
  }

  onShowFollowersModal() {
    if (this.profile.followers) {
      this.followersModal = true;
    }

  }

  onCloseFollowersModal() {
    this.followersModal = false;
    this.loadProfile();
  }

  onShowFollowingModal() {
    if (this.profile.following) {
      this.followingModal = true;
    }

  }

  onCloseFollowingModal() {
    this.followingModal = false;
    this.loadProfile();
  }

  onFollow() {
    if (!this.profile.is_me) {
      this.profile.is_followee = true;
      this.profile.followers++;
      this.userService.followUser(this.profile.id).toPromise();
    }
  }

  onUnfollow() {
    if (!this.profile.is_me) {
      this.profile.is_followee = false;
      this.profile.followers--;
      this.userService.unfollowUser(this.profile.id).toPromise();
    }
  }

  getMe() {
    return {
      id: this.profile.id,
      username: this.profile.username,
      avatar: this.profile.avatar
    };
  }

  clearPhotos() {
    this.photos.splice(0, this.photos.length);
  }

  onCreated(photo: Photo) {
    this.photosPagination.count++;
    this.photos.unshift(photo);
  }

  onEdited() {
    this.loadMe();
  }






}
