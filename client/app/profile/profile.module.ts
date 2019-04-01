import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileDataResolver } from './profile-data.resolver';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { FollowersComponent } from './followers/followers.component';
import { FollowingComponent } from './following/following.component';


@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    EditProfileComponent,
    DeleteAccountComponent,
    CreatePostComponent,
    FollowersComponent,
    FollowingComponent
  ],
  imports: [
    SharedModule,
    ProfileRoutingModule
  ],
  providers: [
    ProfileDataResolver
  ]
})
export class ProfileModule { }
