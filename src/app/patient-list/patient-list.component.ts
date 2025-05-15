// src/app/patient-list/patient-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { PatientModel } from '../models/patient.model';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AppointmentService} from '../services/appointment.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
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
      Id: [''],
      name: ['', Validators.required],
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
    this.patientService.getAllPatients().subscribe((data) => {
      console.log('Raw API response:', data); // Log raw API response
      this.patients = data.map((patient: any) => {
        if (!patient.Id && patient.id) {
          console.warn('Mapping "id" to "Id" for patient:', patient); // Handle different field names
          patient.Id = patient.id; // Map `id` to `Id`
        }

        if (!patient.Id) {
          console.error('Patient with missing Id:', patient); // Log invalid data
        }

        return {
          ...patient,
          Id: patient.Id || null // Ensure `Id` is present
        };
      });
    });
  }

  get filteredPatients() {
    if (!this.searchTerm) {
      return this.patients;
    }

    return this.patients.filter(patient =>
        patient.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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

  openEditDialog(patient: PatientModel, ): void {
    console.log('Opening edit dialog for patient:', patient); // Debugging
    if (patient?.Id) {
      this.selectedPatient = patient;
      this.patientForm.patchValue({
        Id: patient.Id,
        PatientName: patient.name|| '',
        age: patient.age || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        email: patient.email || '',
        address: patient.address || '',
        medicalHistory: patient.medicalHistory || '',
        rendezvous: patient.rendezvous || new Date()
      });
      this.isEditDialogOpen = true;
    } else {
      console.error('Invalid patient selected for editing. Patient data:', patient);
    }
  }

  openDeleteDialog(patient: PatientModel): void {
    if (patient?.Id) {
      this.selectedPatient = patient;
      this.isDeleteDialogOpen = true;
    } else {
      console.error('Invalid patient selected for deletion. Patient data:', patient);
    }
  }

  handleAddPatient(): void {
    if (this.patientForm.invalid) {
      return;
    }


    const newPatient = this.patientForm.value;
    this.patientService.createPatient(newPatient).subscribe(() => {
      this.refreshPatientList();
      this.isAddDialogOpen = false;
    });
  }

  handleEditPatient(): void {
    console.log('Editing patient:', this.selectedPatient); // Debugging
    if (this.patientForm.invalid || !this.selectedPatient?.Id) {
      console.error('Invalid patient or missing Id for update.');
      return;
    }

    const updatedPatient = this.patientForm.value;
    this.patientService.updatePatient(this.selectedPatient.Id, updatedPatient).subscribe({
        next: () => {
          console.log('Patient updated successfully');
          this.refreshPatientList();
          this.isEditDialogOpen = false;
        },
        error: (err: any) => {
          console.error('Error updating patient:', err);
        }
    }
    );
  }

  handleDeletePatient(): void {
    if (this.selectedPatient?.Id) {
      this.patientService.deletePatient(this.selectedPatient.Id).subscribe({
        next: () => {
          console.log('Deleted successfully');
          this.refreshPatientList();
          this.isDeleteDialogOpen = false;
        },
        error: (err: any) => {
          console.error('Error deleting patient:', err);
        }
      });
    } else {
      console.error('No valid patient selected for deletion.');
    }
  }

  getInitials(name: string | undefined): string {
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
