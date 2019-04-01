import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { Pagination } from '../../core/models/pagination.model';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  @Input() open: boolean;
  @Input() profile_id: number;
  @Output() close = new EventEmitter<null>();

  followees: User[] = [];
  followeesLoading: boolean;
  followeesSubscription: Subscription;
  followeesPagination: Pagination = { limit: 15, offset: 0, count: 0, table: 'Followees' };

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {

    this.loadFollowees();
  }




  onClose() {
    this.close.emit();
  }

  hasFollowees() {
    return this.followees.length > 0;
  }
  unsubscribeFollowees() {
    if (this.followeesSubscription) {
      this.followeesSubscription.unsubscribe();
    }

  }

  loadFollowees() {
    this.unsubscribeFollowees();
    this.followeesLoading = true;
    this.followeesSubscription = this.userService.getUserProfileFollowing(this.profile_id, this.followeesPagination)
      .pipe(
        delay(300)
      )
      .subscribe((response) => {

        this.followeesLoading = false;
        this.followeesPagination.count = response.count;
        response.data.forEach(user => {
          this.followees.push(user);
        });
      });
  }

  onLoadFollowees() {
    if (this.followeesLoading) {
      return;
    }
    if (this.hasNext(this.followeesPagination)) {

      this.setNext(this.followeesPagination);
      this.loadFollowees();
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

  onCancel() {
    this.close.emit();
  }


}
