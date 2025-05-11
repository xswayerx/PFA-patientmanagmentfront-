import { Injectable } from '@angular/core';
import { PatientModel } from '../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: PatientModel[];
  patient!: PatientModel;

  constructor() {
    // Initialize with string IDs to match the PatientModel
    this.patients = [
      {PatientId: '1', PatientName: 'John Doe', rendezvous: new Date()},
      {PatientId: '2', PatientName: 'Jane Smith', rendezvous: new Date()},
      {PatientId: '3', PatientName: 'Alice Johnson', rendezvous: new Date()},
      {PatientId: '4', PatientName: 'Bob Brown', rendezvous: new Date()}
    ];

    // Try to load patients from localStorage
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const storedPatients = localStorage.getItem('patients');
    if (storedPatients) {
      try {
        // Parse dates properly
        const parsedPatients = JSON.parse(storedPatients);
        this.patients = parsedPatients.map((p: any) => ({
          ...p,
          rendezvous: p.rendezvous ? new Date(p.rendezvous) : new Date()
        }));
      } catch (error) {
        console.error('Error parsing patients from localStorage', error);
      }
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('patients', JSON.stringify(this.patients));
  }

  getPatients(): PatientModel[] {
    return [...this.patients];
  }

  addPatient(patient: PatientModel) {
    // Generate ID if not provided
    if (!patient.PatientId) {
      patient.PatientId = 'p' + Date.now();
    }

    this.patients.push({...patient});
    this.saveToLocalStorage();
  }

  deletePatient(patient: PatientModel) {
    const index = this.patients.findIndex(p => p.PatientId === patient.PatientId);
    if (index !== -1) {
      this.patients.splice(index, 1);
      this.saveToLocalStorage();
    }
  }

  editPatient(id: number): PatientModel {
    const foundPatient = this.patients.find((p: PatientModel) => p.PatientId === "id");
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
      this.saveToLocalStorage();
    }
  }

  // Additional helper method to get a single patient by ID
  getPatientById(id: string): PatientModel | undefined {
    return this.patients.find(p => p.PatientId === id);
  }
}
