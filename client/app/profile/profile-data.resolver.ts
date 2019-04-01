import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Profile } from '../core/models/profile.model';
import { UserService } from '../core/services/user.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class ProfileDataResolver implements Resolve<Profile> {
  constructor(
    private userService: UserService,
    private router: Router,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Profile> {

    const id = route.params['id'];
    const PROFILE = makeStateKey<any>(`profile-${id}`);

    if (this.transferState.hasKey(id)) {
      const profile = this.transferState.get(PROFILE, null as Profile);
      this.transferState.remove(PROFILE);
      return of(profile);
    } else {
      return this.userService.getUserProfileById(id)
        .pipe(
          tap(
            (profile) => {


              if (isPlatformServer(this.platformId)) {
                this.transferState.set(PROFILE, profile);
              }
            }
          ),
          catchError(error => {
            console.error(error);
            this.router.navigateByUrl('/');
            return of(error);
          })
        );
    }



  }

}
