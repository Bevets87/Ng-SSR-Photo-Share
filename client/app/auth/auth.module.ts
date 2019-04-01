import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NoAuthGuard } from './no-auth-guard.service';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    SharedModule,
    AuthRoutingModule
  ],
  providers: [NoAuthGuard]
})
export class AuthModule { }
