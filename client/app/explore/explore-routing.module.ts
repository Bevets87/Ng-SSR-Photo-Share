import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { AuthGuard } from '../core/services/auth-guard.service';
import { ExploreDataResolver } from './explore-data.resolver';

const routes: Routes = [
  {
    path: '',
    component: ExploreComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: ExploreDataResolver
    }
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExploreRoutingModule { }
