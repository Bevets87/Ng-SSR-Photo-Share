import { NgModule } from '@angular/core';
import { TagRoutingModule } from './tag-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TagComponent } from './tag.component';
import { TagDataResolver } from './tag-data.resolver';

@NgModule({
  declarations: [TagComponent],
  imports: [
    SharedModule,
    TagRoutingModule
  ],
  providers: [
    TagDataResolver
  ]
})
export class TagModule { }
