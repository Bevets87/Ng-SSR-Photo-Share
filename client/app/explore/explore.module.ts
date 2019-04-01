import { NgModule } from '@angular/core';
import { ExploreComponent } from './explore.component';
import { ExploreRoutingModule } from './explore-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ExploreDataResolver } from './explore-data.resolver';

@NgModule({
  declarations: [ExploreComponent],
  imports: [
    SharedModule,
    ExploreRoutingModule,
  ],
  providers: [
    ExploreDataResolver
  ]
})
export class ExploreModule { }
