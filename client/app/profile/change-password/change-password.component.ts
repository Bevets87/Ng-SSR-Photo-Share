import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Input() open: boolean;
  @Output() close = new EventEmitter<null>();

  old_password: string;
  new_password: string;
  error: string;


  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.old_password = '';
    this.new_password = '';



  }

  onClose() {
    this.close.emit();
  }

  onCancel() {
    this.close.emit();
  }

  onSubmit() {
    this.userService.changePassword({
      old_password: this.old_password,
      new_password: this.new_password
    }).toPromise()
    .then(() => {
      this.close.emit();
    })
    .catch((response) => {

      this.error = response.error.sqlMessage ? response.error.sqlMessage : response.error.message;
    });
  }

}
