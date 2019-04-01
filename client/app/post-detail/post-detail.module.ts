import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PostDetailComponent } from './post-detail.component';
import { PostDetailRoutingModule } from './post-detail-routing.module';
import { PostDetailDataResolver } from './post-detail-data.resolver';

@NgModule({
  declarations: [PostDetailComponent],
  imports: [
    SharedModule,
    PostDetailRoutingModule
  ],
  providers: [
    PostDetailDataResolver
  ]
})
export class PostDetailModule { }
