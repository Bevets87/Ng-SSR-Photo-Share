import { Component, Output, Input, EventEmitter } from '@angular/core';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input() navigateable: boolean;
  @Input() users: User[] = [];
  @Input() title: string;
  @Output() load = new EventEmitter<null>();
  constructor() { }

  onScrollBottom() {
    this.load.emit();
  }
  getUserStyles() {
    return {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    };
  }
}
