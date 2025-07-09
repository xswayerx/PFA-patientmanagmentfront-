// src/app/layouts/main-layout/main-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet, RouterLink, Router} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="bg-gradient-primary text-white py-5 shadow-sm" style="background: linear-gradient(90deg, #4e73df 0%, #1cc88a 100%); border-radius: 0 0 1.5rem 1.5rem;">
      <div class="container">
        <h1 class="display-4 fw-bold mb-2">Patient Appointment System</h1>
        <p class="lead mb-0">Manage patients and schedule appointments with ease</p>
      </div>
    </header>

    <div class="container mt-5 mb-4">
      <div class="card shadow-lg border-0" style="border-radius: 1.25rem;">
        <div class="card-body pb-0">
          <!-- tab-->
          <ul class="nav nav-tabs nav-justified mb-4" style="border-bottom: none;">
            <li class="nav-item">
              <a class="nav-link px-4 py-3" [class.active]="isActive('dashboard')" routerLink="/dashboard" style="border-radius: 1rem 1rem 0 0;">
                <i class="bi bi-speedometer2 me-2"></i> Dashboard
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-4 py-3" [class.active]="isActive('patients')" routerLink="/patient-list" style="border-radius: 1rem 1rem 0 0;">
                <i class="bi bi-people-fill me-2"></i> Patients
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link px-4 py-3" [class.active]="isActive('appointments')" routerLink="/appointments" style="border-radius: 1rem 1rem 0 0;">
                <i class="bi bi-calendar-check me-2"></i> Appointments
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <router-outlet></router-outlet>

    <footer class="bg-white border-top py-4 mt-5 shadow-sm" style="border-radius: 1.5rem 1.5rem 0 0;">
      <div class="container text-center text-muted small">
        <p class="mb-0">© 2025 Patient Appointment System. All rights reserved.</p>
      </div>
    </footer>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
  `
  })
export class MainLayoutComponent {
constructor(private router: Router) {}

isActive(route: string): boolean {
if (route === 'dashboard') return this.router.url.includes('dashboard');
if (route === 'patients') return this.router.url.includes('patient-list');
if (route === 'appointments') return this.router.url.includes('appointments');
return false;
}
  }
