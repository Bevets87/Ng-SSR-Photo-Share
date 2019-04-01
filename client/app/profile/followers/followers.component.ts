import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { Subscription } from 'rxjs';
import { Pagination } from '../../core/models/pagination.model';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
  @Input() open: boolean;
  @Input() profile_id: number;
  @Output() close = new EventEmitter<null>();

  followers: User[] = [];
  followersLoading: boolean;
  followersSubscription: Subscription;
  followersPagination: Pagination = { limit: 15, offset: 0, count: 0, table: 'Followers' };
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {

    this.loadFollowers();

  }


  onClose() {
    this.close.emit();
  }

  hasFollowers() {
    return this.followers.length > 0;
  }
  unsubscribeFollowers() {
    if (this.followersSubscription) {
      this.followersSubscription.unsubscribe();
    }

  }

  loadFollowers() {
    this.unsubscribeFollowers();
    this.followersLoading = true;
    this.followersSubscription = this.userService.getUserProfileFollowers(this.profile_id, this.followersPagination)
    .pipe(
      delay(300)
    )
    .subscribe((response) => {
      this.followersLoading = false;
      this.followersPagination.count = response.count;
      response.data.forEach(user => {
        this.followers.push(user);
      });
    });
  }

  onLoadFollowers() {
    if (this.followersLoading) {
      return;
    }
    if (this.hasNext(this.followersPagination)) {

      this.setNext(this.followersPagination);
      this.loadFollowers();
    }
  }

  private hasNext(pagination: Pagination): boolean {
    const next = pagination.limit + pagination.offset;
    return next < pagination.count;
  }
  private setNext(pagination: Pagination) {
    const next = pagination.limit + pagination.offset;
    pagination.offset = next;
  }

  onOk() {
    this.close.emit();
  }

  onSave() {
    this.close.emit();
  }

}
