// app.config.ts
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { KeycloakService } from './auth/keycloak.service';
import { KeycloakAuthInterceptor } from './auth/keycloak-auth.interceptor';

function initKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClientModule), // ✅ Add this line
    {
      provide: APP_INITIALIZER,
      useFactory: initKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakAuthInterceptor,
      multi: true,
    },
    provideRouter(routes)
  ]
};
