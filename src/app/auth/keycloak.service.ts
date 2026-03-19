import { Injectable } from '@angular/core';
import Keycloak, { type KeycloakInstance, type KeycloakInitOptions, type KeycloakLoginOptions } from 'keycloak-js';
import { keycloakConfig } from './keycloak.config';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak?: KeycloakInstance;
  private initialized = false;

  async init(): Promise<boolean> {
    if (this.initialized) return !!this.keycloak?.authenticated;

    this.keycloak = new Keycloak({
      url: keycloakConfig.url,
      realm: keycloakConfig.realm,
      clientId: keycloakConfig.clientId,
    });

    const initOptions: KeycloakInitOptions = {
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      checkLoginIframe: false,
      
      redirectUri: window.location.origin + '/',

    };

    const authenticated = await this.keycloak.init(initOptions);
    this.initialized = true;
    return authenticated;
  }

  isAuthenticated(): boolean {
    return !!this.keycloak?.authenticated;
  }

  getUsername(): string | undefined {
    const parsed = this.keycloak?.tokenParsed as any;
    return parsed?.preferred_username || parsed?.email || parsed?.name;
  }

  getRealmRoles(): string[] {
    const parsed = this.keycloak?.tokenParsed as any;
    const roles = parsed?.realm_access?.roles;
    return Array.isArray(roles) ? roles : [];
  }

  async login(redirectUri?: string): Promise<void> {
    if (!this.keycloak) {
      await this.init();
    }

    const options: KeycloakLoginOptions = {
      // Default to app root to keep Keycloak redirect URI configuration simple
      // (e.g. Valid redirect URIs: http://localhost:4200/*)
      redirectUri: redirectUri ?? window.location.origin + '/',
    };

    await this.keycloak!.login(options);
  }

  async logout(): Promise<void> {
    if (!this.keycloak) return;
    await this.keycloak.logout({ redirectUri: window.location.origin + '/login' });
  }

  async getToken(): Promise<string> {
    if (!this.keycloak) {
      await this.init();
    }

    if (!this.keycloak) return '';

    // Refresh token if it will expire soon
    try {
      await this.keycloak.updateToken(30);
    } catch {
      // If refresh fails, treat as unauthenticated
      return '';
    }

    return this.keycloak.token || '';
  }
}
