import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Photo } from '../../../core/models/photo.model';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss']
})
export class PhotoGalleryComponent {
  @Input() title: string;
  @Input() loading: boolean;
  @Input() photos: Photo[];
  @Input() deletable: boolean;
  @Output() load = new EventEmitter<null>();
  @Output() delete = new EventEmitter<number>();
  constructor() { }
  onScrollBottom() {
    this.load.emit();
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}
