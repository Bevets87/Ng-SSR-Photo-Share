import {
  Directive,
  ViewContainerRef,
  TemplateRef,
  Input,
  OnInit
} from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appShowAuthed]'
})
export class ShowAuthedDirective implements OnInit {
  private condition: boolean;
  constructor (
    private authService: AuthService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit() {
    this.authService.authenticated.subscribe(
      (authenticated) => {
        if (authenticated && this.condition || !authenticated && !this.condition) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      }
    );
  }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }


}
