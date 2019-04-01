import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  @Input() me: User;
  @Input() open: boolean;
  @Output() close = new EventEmitter<null>();
  @Output() edited = new EventEmitter<null>();

  username: string;
  avatar: string;
  error: string;


  constructor(

    private userService: UserService,

  ) { }

  ngOnInit() {
    this.username = this.me.username;
    this.avatar = this.me.avatar;
  }

  onClose() {
    this.close.emit();
  }



  onSave() {

    this.userService.updateMe({
      username: this.username,
      avatar: this.avatar
    }).toPromise()
    .then(() => {
      this.edited.emit();
      this.close.emit();
    })
    .catch((response) => {
      this.error = response.error.sqlMessage ? response.error.sqlMessage : response.error.message;
    });


  }





}
