import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PostDetailComponent } from './post-detail.component';
import { AuthGuard } from '../core/services/auth-guard.service';
import { PostDetailDataResolver } from './post-detail-data.resolver';

const routes: Route[] = [
  {
    path: ':id',
    component: PostDetailComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: PostDetailDataResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostDetailRoutingModule {}
