import { Routes } from '@angular/router';
import { PatientListComponent } from './patient-list/patient-list.component';
import { AddPatientComponent} from './add-patient/add-patient.component';
import {EditPatientComponent} from './edit-patient/edit-patient.component';
import {LoginComponent} from './login/login.component';
export const routes: Routes = [
  {path : "patient-list", component :PatientListComponent},
  {path : "add-patient", component :AddPatientComponent},
  {path : "edit-patient/:id", component :EditPatientComponent},
  {path : "login", component: LoginComponent}, // Remove the :id parameter
   {path : "", redirectTo : "login", pathMatch : "full"},
];
