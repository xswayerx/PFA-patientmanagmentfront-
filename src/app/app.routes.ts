// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard]},
  {path: "patient-list", component: PatientListComponent, canActivate: [AuthGuard]},
  {path: "appointments", component: AppointmentComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: "login", pathMatch: "full"},
];
