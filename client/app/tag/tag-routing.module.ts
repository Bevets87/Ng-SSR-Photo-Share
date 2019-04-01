import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TagComponent } from './tag.component';
import { AuthGuard } from '../core/services/auth-guard.service';
import { TagDataResolver } from './tag-data.resolver';

const routes: Route[] = [
  {
    path: ':id',
    component: TagComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: TagDataResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagRoutingModule { }
