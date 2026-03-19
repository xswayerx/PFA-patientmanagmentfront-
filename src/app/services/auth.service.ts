import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import { KeycloakService } from '../auth/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public username: string | undefined;
  public roles: string[] = [];

  constructor(private router: Router, private keycloak: KeycloakService) {
    this.syncFromKeycloak();
  }

  get isAuthenticated(): boolean {
    this.syncFromKeycloak();
    return this.keycloak.isAuthenticated();
  }

  hasRole(role: string): boolean {
    this.syncFromKeycloak();
    return this.roles.includes(role);
  }

  // Legacy signature kept for compatibility with existing LoginComponent.
  // With Keycloak, credentials are handled by the IdP.
  public async login(_username?: string, _password?: string): Promise<boolean> {
    await this.keycloak.login();
    this.syncFromKeycloak();
    return this.isAuthenticated;
  }

  async logout(): Promise<void> {
    await this.keycloak.logout();
    this.syncFromKeycloak();
    await this.router.navigateByUrl('/login');
  }

  private syncFromKeycloak(): void {
    this.username = this.keycloak.getUsername();
    this.roles = this.keycloak.getRealmRoles();
  }

}
