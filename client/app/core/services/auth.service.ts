import { Injectable, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthInfo } from '../models/auth-info.model';
import { Router } from '@angular/router';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { REQUEST } from '@nguniversal/express-engine/tokens';






@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  public  authenticated = this.authenticatedSubject.asObservable();
  private errorMessageSubject =  new BehaviorSubject<string>(null);
  public errorMessage = this.errorMessageSubject.asObservable();
  private userSubject = new BehaviorSubject<User>(null as User);
  public user = this.userSubject.asObservable();

  constructor(

    private httpClient: HttpClient,
    private router: Router,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string,
    private injector: Injector



  ) {}
  private setAuthentication(authenticated: boolean, user: User) {
    this.authenticatedSubject.next(authenticated);
    this.userSubject.next(user);
  }

  setAuthOnInitialLoad() {
    const SESSION = makeStateKey('session');
    if (isPlatformServer(this.platformId)) {
      const request = this.injector.get(REQUEST);
      const request_session = request['session'];
      const authenticated = request_session['authenticated'] ? request_session['authenticated'] : false;
      const user = request_session['user'] ? request_session['user'] : null;
      this.transferState.set(SESSION, { authenticated, user });
      this.setAuthentication(authenticated, user);
    }
    if (isPlatformBrowser(this.platformId)) {
      const session = this.transferState.get(SESSION, { user: null, authenticated: false });
      this.transferState.remove(SESSION);
      this.setAuthentication(session.authenticated, session.user);
    }




  }

  login(payload: AuthInfo) {
    this.httpClient.post(`/auth/login`, payload)
    .subscribe(
      (response: User) => {
        this.setAuthentication(true, response);
        this.router.navigateByUrl('/');
      },
      (response: HttpErrorResponse) => {
        this.errorMessageSubject.next(response.error.message);
      }
    );
  }
  register(payload: AuthInfo) {
    this.httpClient.post(`/auth/register`, payload)
    .subscribe(
      (response: User) => {

        this.setAuthentication(true, response);

        this.router.navigateByUrl('/');
      },
      (response: HttpErrorResponse) => {
        this.errorMessageSubject.next(response.error.message);
      }
    );
  }
  logout() {
    this.httpClient.post(`/auth/logout`, {})
    .subscribe(
      (response: HttpResponse<null>) => {
        this.setAuthentication(false, null as User);

        this.router.navigateByUrl('/login');
      },
      (response: HttpErrorResponse) => {
        this.errorMessageSubject.next(response.error.message);
      }
    );
  }
  clearError() {
    this.errorMessageSubject.next(null);
  }




}
