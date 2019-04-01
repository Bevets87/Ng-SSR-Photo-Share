import { Injectable, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';




@Injectable()
export class HttpUniversalInterceptor implements HttpInterceptor {
  constructor(
   private injector: Injector,
   @Inject(PLATFORM_ID) private platformId: string
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({ withCredentials: true });
    if (isPlatformServer(this.platformId)) {
      const URL = `${this.injector.get('BASE_URL')}${req.url}`;
      const HEADERS = this.injector.get('HEADERS');
      req = req.clone({
        url: URL,
        setHeaders: HEADERS
      });
    }
    return next.handle(req);

  }
}
