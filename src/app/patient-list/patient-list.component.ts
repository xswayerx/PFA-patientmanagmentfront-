// src/app/patient-list/patient-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { PatientModel } from '../models/patient.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule]
})
export class PatientListComponent implements OnInit {
  patients: PatientModel[] = [];
  searchTerm: string = '';
  isAddDialogOpen: boolean = false;
  isEditDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;
  selectedPatient: PatientModel | null = null;

  patientForm: FormGroup;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder
  ) {
    this.patientForm = this.fb.group({
      PatientId: [''],
      PatientName: ['', Validators.required],
      age: [''],
      gender: [''],
      phone: ['', Validators.required],
      email: [''],
      address: [''],
      medicalHistory: [''],
      rendezvous: [new Date()]
    });
  }

  ngOnInit(): void {
    this.refreshPatientList();
  }

  refreshPatientList(): void {
    this.patients = this.patientService.getPatients();
  }

  get filteredPatients() {
    if (!this.searchTerm) {
      return this.patients;
    }

    return this.patients.filter(patient =>
      patient.PatientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddDialog(): void {
    this.patientForm.reset({
      rendezvous: new Date()
    });
    this.isAddDialogOpen = true;
  }

  openEditDialog(patient: PatientModel): void {
    this.selectedPatient = patient;
    this.patientForm.setValue({
      PatientId: patient.PatientId,
      PatientName: patient.PatientName,
      age: patient.age || '',
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      medicalHistory: patient.medicalHistory || '',
      rendezvous: patient.rendezvous || new Date()
    });
    this.isEditDialogOpen = true;
  }

  openDeleteDialog(patient: PatientModel): void {
    this.selectedPatient = patient;
    this.isDeleteDialogOpen = true;
  }

  handleAddPatient(): void {
    if (this.patientForm.invalid) {
      return;
    }

    const newPatient = this.patientForm.value;
    this.patientService.addPatient(newPatient);
    this.refreshPatientList();
    this.isAddDialogOpen = false;
  }

  handleEditPatient(): void {
    if (this.patientForm.invalid) {
      return;
    }

    const updatedPatient = this.patientForm.value;
    this.patientService.updatePatient(updatedPatient);
    this.refreshPatientList();
    this.isEditDialogOpen = false;
  }

  handleDeletePatient(): void {
    if (this.selectedPatient) {
      this.patientService.deletePatient(this.selectedPatient);
      this.refreshPatientList();
      this.isDeleteDialogOpen = false;
    }
  }

  getInitials(name: string): string {
    if (!name) return '--';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  closeDialog(): void {
    this.isAddDialogOpen = false;
    this.isEditDialogOpen = false;
    this.isDeleteDialogOpen = false;
  }
}
