import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { map } from 'rxjs/operators';

@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):  Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.authenticated.pipe(
      map(authenticated => {
        if (authenticated) {
          this.router.navigateByUrl('/');
        }

        return !authenticated;
      })
    );

  }

}
