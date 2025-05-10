import { Injectable } from '@angular/core';
import {PatientModel} from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patients: PatientModel [];
  patient!: PatientModel;

  constructor() {
    this.patients = [
      {PatientId: 1, PatientName: 'John Doe', rendezvous: new Date()},
      {PatientId: 2, PatientName: 'Jane Smith', rendezvous: new Date()},
      {PatientId: 3, PatientName: 'Alice Johnson', rendezvous: new Date()},
      {PatientId: 4, PatientName: 'Bob Brown', rendezvous: new Date()}
    ];
  }

  productsList(): PatientModel[] {
    return this.patients
  }

  addPatient(patient: PatientModel) {
    this.patients.push(patient);
  }

  deletePatient(pat: PatientModel) {
    const index = this.patients.indexOf(pat, 0);
    this.patients.splice(index, 1);
  }
  editPatient(id : number){
    this.patient = this.patients.find((p: PatientModel) => p.PatientId === id)!;
    return this.patient;
  }
  updatePatient(prod : PatientModel){
    this.deletePatient(prod);
    this.addPatient(prod);
    // this.sortPatient();
  }

  getPatientById(patientId: string) {
    return this.patients.find(patient => patient.PatientId === Number(patientId));

  }


}
