import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../core/services/search.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { switchMap, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Router } from '@angular/router';


@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {
  searchField: FormControl;
  searchForm: FormGroup;
  searchSubscription: Subscription;
  searchData: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchField = new FormControl();
    this.searchForm = this.formBuilder.group({search: this.searchField});

    this.searchSubscription = this.searchField.valueChanges.pipe(
      filter((term: string) => term.length > 0),
      switchMap((term: string) => {
        return this.searchService.search(term);
      })
    )
    .subscribe((data: any[]) => {
      this.searchData = data;

    });
  }

  hasData(): boolean {
    return this.searchData.length > 0;
  }

  hasInput(): boolean {
    return this.searchField.value;
  }

  isTag(item): boolean {
    return item.type === 'tag';
  }




  onNavigate(item) {
    if (item.type === 'tag') {

      this.router.navigateByUrl(`/tags/${item.id}`);
      this.searchField.setValue('');
    } else {
      this.router.navigateByUrl(`/profile/${item.id}`);
      this.searchField.setValue('');
    }
  }


}
