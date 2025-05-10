import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientService} from '../services/patient.service';
import {PatientModel} from '../models/patient.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.css',
  standalone: true
})
export class PatientListComponent {

  patients: PatientModel[];

  constructor(private patientService: PatientService) {
    this.patients = this.patientService.getPatients();
  }
  ngOnInit(): void {
    this.refreshPatientList();
  }
  refreshPatientList(): void {
    this.patients = this.patientService.getPatients();
  }

  Delete(patientId: PatientModel) {
    let conf = confirm("Are you sure to delete this product ?")
    if(conf) {
      this.patientService.deletePatient(patientId);
      this.patients = this.patientService.getPatients();
    }
  }


}
