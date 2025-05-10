import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientModel } from '../models/patient.model';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-add-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.css'
})
export class AddPatientComponent implements OnInit {
  patientForm!: FormGroup;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.patientForm = this.fb.group({
      PatientId: [''],
      PatientName: [''],
      rendezvous: [''],
      dateCreation: ['']
    });
  }

  addPatient() {
    if (this.patientForm.valid) {
      const newPatient = this.patientForm.value as PatientModel;
      this.patientService.addPatient(newPatient);
      this.patientForm.reset();
    }
  }
}
