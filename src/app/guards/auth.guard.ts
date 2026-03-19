// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (this.authService.isAuthenticated) {
      return true;
    }

    // Kick off Keycloak login. Keycloak will redirect back to the app.
    // We return false to cancel current navigation.
    await this.authService.login();
    return false;
  }
}
