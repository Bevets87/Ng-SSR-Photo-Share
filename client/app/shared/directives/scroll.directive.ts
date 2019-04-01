import {
  Directive,
  AfterViewInit,
  Output,
  Input,
  EventEmitter,
  OnDestroy,
  ElementRef
} from '@angular/core';
import { Observable, fromEvent, Subscription, of } from 'rxjs';
import { map, pairwise, filter, catchError } from 'rxjs/operators';



@Directive({
  selector: '[appScroll]'
})
export class ScrollDirective implements AfterViewInit, OnDestroy {
  private scrollPercent: number;
  private scrollEvent$: Observable<any>;
  private scrollBottom$: Observable<any>;
  private subscription: Subscription;
  @Output() scrollBottom = new EventEmitter<any>();
  constructor(

    private element: ElementRef

  ) {}
  ngAfterViewInit() {
    this.setScrollEvent$();
    this.setScrollBottom$();
    this.subscription = this.scrollBottom$.subscribe(
        () => {
          this.scrollBottom.emit();
        }
      );



  }
  @Input() set appScroll(percentage: number) {
    if (percentage >= 0 && percentage <= 100) {
      this.scrollPercent = percentage;
    } else {
      this.scrollPercent = 90;
    }

  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  private setScrollEvent$() {
    const element = this.element.nativeElement;

    this.scrollEvent$ = fromEvent(element, 'scroll');
  }
  private setScrollBottom$() {
    this.scrollBottom$ = this.scrollEvent$.pipe(

      map((e: any) => ({
        scrollHeight: e.target.scrollHeight,
        scrollTop: e.target.scrollTop,
        clientHeight: e.target.clientHeight
      })),
      pairwise(),
      filter(([previous, current]) => this.isScrollingDown(previous, current) && this.isBottom(current)),
      catchError((error) => {
        console.error(error);
        return of(error);
      })
    );
  }

  private isScrollingDown = (previous, current) => {
    return previous.scrollTop < current.scrollTop;
  }

  private isBottom = (current) => {
    return ((current.scrollTop + current.clientHeight) / current.scrollHeight) > (this.scrollPercent / 100);
  }



}
