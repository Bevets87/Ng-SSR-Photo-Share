import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Pagination } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input()  pagination: Pagination;
  @Output() pageChange = new EventEmitter<Pagination>();
  constructor() {}
  ngOnInit() {}
  getFirstPage() {
    return 1;
  }
  getCurrentPage() {
    return Math.ceil((this.pagination.offset / this.pagination.limit) + 1);
  }
  getLastPage() {
    return Math.ceil(this.pagination.count / this.pagination.limit);
  }
  hasFirstPage() {
    return this.getCurrentPage() > this.getFirstPage();
  }
  hasLastPage() {
    return this.getCurrentPage() < this.getLastPage();
  }


  onFirst() {
    if (this.hasFirstPage()) {
      this.pagination.offset = 0;
      this.pageChange.emit(this.pagination);
    }
  }
  onNext() {
    if (this.hasLastPage()) {
      this.pagination.offset = this.pagination.offset + this.pagination.limit;
      this.pageChange.emit(this.pagination);
    }
  }
  onPrevious() {
    if (this.hasFirstPage()) {
      this.pagination.offset =  this.pagination.offset - this.pagination.limit;
      this.pageChange.emit(this.pagination);
    }
  }
  onLast() {
    if (this.hasLastPage()) {
      const last = this.getLastPage();
      this.pagination.offset = (last - 1) * this.pagination.limit;
      this.pageChange.emit(this.pagination);
    }
  }

  hasCount() {
    return this.pagination.count;
  }
  getOffsetStart() {
    return this.pagination.offset + 1;
  }
  getOffsetEnd() {
    const end = this.pagination.limit + this.pagination.offset;
    return end > this.pagination.count ? this.pagination.count : end;
  }





}
