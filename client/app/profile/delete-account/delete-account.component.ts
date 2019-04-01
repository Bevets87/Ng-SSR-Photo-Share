import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.scss']
})
export class DeleteAccountComponent implements OnInit {
  @Input() me: User;
  @Input() open: boolean;
  @Output() close = new EventEmitter<null>();
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  onYes() {
    this.userService.deleteMe(this.me.id)
    .subscribe(
      () => {
        this.authService.logout();
      }
    );
  }


}
