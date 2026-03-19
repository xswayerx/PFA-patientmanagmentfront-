// src/app/layouts/main-layout/main-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet, RouterLink, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="app-topbar">
      <div class="container-fluid app-topbar-inner">
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div class="d-flex align-items-center gap-3">
            <div class="metric-icon" aria-hidden="true">
              <i class="fas fa-heartbeat"></i>
            </div>
            <div>
              <div class="app-brand-title">Patient Appointment System</div>
              <div class="app-brand-subtitle">Modern medical dashboard</div>
            </div>
          </div>

          <nav class="app-nav" aria-label="Primary">
            <a class="app-nav-link" [class.active]="isActive('dashboard')" routerLink="/dashboard">
              <i class="fas fa-chart-pie"></i>
              <span>Dashboard</span>
            </a>
            <a class="app-nav-link" [class.active]="isActive('patients')" routerLink="/patient-list">
              <i class="fas fa-user-injured"></i>
              <span>Patients</span>
            </a>
            <a class="app-nav-link" [class.active]="isActive('appointments')" routerLink="/appointments">
              <i class="fas fa-calendar-check"></i>
              <span>Appointments</span>
            </a>
          </nav>

          <div class="d-flex align-items-center gap-2">
            <button type="button" class="btn btn-sm btn-outline-secondary" (click)="logout()" title="Logout">
              <i class="fas fa-right-from-bracket me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="container app-container app-page">
      <router-outlet></router-outlet>
    </main>

    <footer class="py-4">
      <div class="container app-container text-center text-muted small">
        <span>© 2026 Patient Appointment System</span>
      </div>
    </footer>
  `
  })
export class MainLayoutComponent {
constructor(private router: Router, private authService: AuthService) {}

isActive(route: string): boolean {
if (route === 'dashboard') return this.router.url.includes('dashboard');
if (route === 'patients') return this.router.url.includes('patient-list');
if (route === 'appointments') return this.router.url.includes('appointments');
return false;
}

async logout(): Promise<void> {
  await this.authService.logout();
}
  }
