import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { AuthGuard } from '../core/services/auth-guard.service';
import { ProfileDataResolver } from './profile-data.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    resolve: {
      data: ProfileDataResolver
    }

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
