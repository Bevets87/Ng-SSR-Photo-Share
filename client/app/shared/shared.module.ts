import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PaginationComponent } from './components/pagination/pagination.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { PhotoGalleryComponent } from './components/photo-gallery/photo-gallery.component';
import { PhotoComponent } from './components/photo/photo.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { UserListComponent } from './components/user-list/user-list.component';

import { UserComponent } from './containers/user/user.component';
import { SearchInputComponent } from './containers/search-input/search-input.component';
import { PostComponent } from './containers/post/post.component';
import { PostHeaderComponent } from './containers/post/post-header/post-header.component';
import { PostCommentListComponent } from './containers/post/post-comment-list/post-comment-list.component';
import { PostFooterComponent } from './containers/post/post-footer/post-footer.component';
import { PostPhotoComponent } from './containers/post/post-photo/post-photo.component';
import { PostIconMenuComponent } from './containers/post/post-icon-menu/post-icon-menu.component';

import { ShowAuthedDirective } from './directives/show-authed.directive';
import { ScrollDirective } from './directives/scroll.directive';


@NgModule({
  imports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [
    AvatarComponent,
    PostListComponent,
    PhotoGalleryComponent,
    PhotoComponent,
    UserListComponent,
    UserComponent,
    PaginationComponent,
    SpinnerComponent,
    PostComponent,
    PostHeaderComponent,
    PostFooterComponent,
    PostCommentListComponent,
    PostIconMenuComponent,
    PostPhotoComponent,
    ShowAuthedDirective,
    SearchInputComponent,
    ScrollDirective


  ],
  exports: [
    CommonModule,
    ClarityModule,
    FormsModule,
    PostComponent,
    ReactiveFormsModule,
    HttpClientModule,
    ShowAuthedDirective,
    AvatarComponent,
    PostListComponent,
    PhotoGalleryComponent,
    UserListComponent,
    SpinnerComponent,
    SearchInputComponent,
    ScrollDirective
  ]
})
export class SharedModule { }
