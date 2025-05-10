import { Injectable } from '@angular/core';
import { PatientModel } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patients: PatientModel[];
  patient!: PatientModel;

  constructor() {
    this.patients = [
      {PatientId: 1, PatientName: 'John Doe', rendezvous: new Date()},
      {PatientId: 2, PatientName: 'Jane Smith', rendezvous: new Date()},
      {PatientId: 3, PatientName: 'Alice Johnson', rendezvous: new Date()},
      {PatientId: 4, PatientName: 'Bob Brown', rendezvous: new Date()}
    ];
  }

  getPatients(): PatientModel[] {
    return this.patients;
  }

  addPatient(patient: PatientModel) {
    this.patients.push(patient);
  }

  deletePatient(patient: PatientModel) {
    const index = this.patients.findIndex(p => p.PatientId === patient.PatientId);
    if (index !== -1) {
      this.patients.splice(index, 1);
    }
  }

  editPatient(id: number) {
    const foundPatient = this.patients.find((p: PatientModel) => p.PatientId === id);
    if (foundPatient) {
      // Create a copy to avoid direct reference modification
      this.patient = {...foundPatient};
      return this.patient;
    }
    return new PatientModel();
  }

  updatePatient(updatedPatient: PatientModel) {
    const index = this.patients.findIndex(p => p.PatientId === updatedPatient.PatientId);
    if (index !== -1) {
      this.patients[index] = {...updatedPatient};
    }
  }
}
