import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @Input() navigateable: boolean;
  @Input() user: User;

  constructor(
    private router: Router,
    private userService: UserService

  ) {}
  ngOnInit() {

  }
  onFollow() {
    if (this.user.is_me) {
      return;
    }
    this.user.is_followee = true;
    this.userService.followUser(this.user.id)
    .toPromise();
  }
  onUnfollow() {
    if (this.user.is_me) {
      return;
    }
    this.user.is_followee = false;
    this.userService.unfollowUser(this.user.id)
    .toPromise();
  }
  onProfile() {
    if (!this.navigateable) {
      return;
    }
    this.router.navigateByUrl(`/profile/${this.user.id}`);
  }



}
