import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './home/home.module#HomeModule' },
  { path: 'p', loadChildren: './post-detail/post-detail.module#PostDetailModule'},
  { path: 'explore', loadChildren: './explore/explore.module#ExploreModule' },
  { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
  { path: 'tags', loadChildren: './tag/tag.module#TagModule' },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
