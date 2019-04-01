import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy  {
  me: User;
  meSubscription: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscribeMe();
  }
  ngOnDestroy() {
    this.unsubscribeMe();
  }

  subscribeMe() {
    this.meSubscription = this.authService.user.subscribe(
      (me: User) => {
        this.me = me;
      }
    );
  }
  unsubscribeMe() {
    if (this.meSubscription) {
      this.meSubscription.unsubscribe();
    }

  }
  onLogout() {
    this.authService.logout();
  }
  private getProfilePath(): string {
    return `/profile/${this.me.id}`;
  }
  onProfile() {
    const path = this.getProfilePath();
    this.router.navigateByUrl(path);
  }





}
