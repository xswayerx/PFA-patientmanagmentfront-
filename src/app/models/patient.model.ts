// src/app/models/patient.model.ts
export class PatientModel {
  PatientId: string;
  PatientName: string;
  rendezvous: Date;

  // New fields
  age?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  medicalHistory?: string;

  constructor() {
    this.PatientId = '';
    this.PatientName = '';
    this.rendezvous = new Date();
  }
}
