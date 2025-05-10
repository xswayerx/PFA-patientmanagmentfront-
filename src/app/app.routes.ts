// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { AddPatientComponent } from './add-patient/add-patient.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {path: "patient-list", component: PatientListComponent, canActivate: [AuthGuard]},
  {path: "add-patient", component: AddPatientComponent, canActivate: [AuthGuard]},
  {path: "edit-patient/:id", component: EditPatientComponent, canActivate: [AuthGuard]},
  {path: "login", component: LoginComponent},
  {path: "", redirectTo: "login", pathMatch: "full"},
];
