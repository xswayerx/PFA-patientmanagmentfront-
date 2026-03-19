import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { KeycloakService } from './keycloak.service';

@Injectable()
export class KeycloakAuthInterceptor implements HttpInterceptor {
  constructor(private keycloak: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only attach token for your backend API.
    // (Avoids sending tokens to CDNs / other domains.)
    const isApiCall = req.url.startsWith('http://localhost:8080/api/') || req.url.startsWith('/api/');
    if (!isApiCall) return next.handle(req);

    return from(this.keycloak.getToken()).pipe(
      switchMap((token) => {
        if (!token) return next.handle(req);

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next.handle(authReq);
      })
    );
  }
}
