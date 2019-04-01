import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Photo } from '../../../core/models/photo.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit {
  @Input() photo: Photo;
  @Input() deletable: boolean;
  @Output() delete = new EventEmitter<number>();

  constructor(
    private router: Router
  ) { }
  ngOnInit() {

  }
  onError(e) {
    this.photo.image_url = 'https://www.fillmurray.com/350/225';
  }

  onDelete() {
    this.delete.emit(this.photo.id);
  }
  onNavigateToPost() {
    this.router.navigateByUrl(`/p/${this.photo.id}`);
  }

  onNavigateToProfile() {
    this.router.navigateByUrl(`/profile/${this.photo.user_id}`);
  }



}
