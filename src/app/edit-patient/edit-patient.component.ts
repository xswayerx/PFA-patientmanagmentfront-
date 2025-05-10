import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../services/patient.service';
import { PatientModel } from '../models/patient.model';

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  CurrentPatient: PatientModel = new PatientModel();
  patientForm!: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Convert the ID from string to number with the "+" operator
    const patientId = +this.activatedRoute.snapshot.params['id'];
    this.CurrentPatient = this.patientService.editPatient(patientId);
    this.initForm();
  }

  private initForm(): void {
    // Convert Date to YYYY-MM-DD format for the date input
    let formattedDate = '';
    if (this.CurrentPatient.rendezvous) {
      const date = new Date(this.CurrentPatient.rendezvous);
      formattedDate = date.toISOString().split('T')[0];
    }

    this.patientForm = this.fb.group({
      PatientId: [this.CurrentPatient.PatientId, Validators.required],
      PatientName: [this.CurrentPatient.PatientName, Validators.required],
      rendezvous: [formattedDate, Validators.required]
    });
  }
  updatePatient(): void {
    console.log('Form submitted:', this.patientForm.value);
    console.log('Form valid:', this.patientForm.valid);

    if (this.patientForm.valid) {
      // Update patient object with form values
      this.CurrentPatient.PatientId = this.patientForm.value.PatientId;
      this.CurrentPatient.PatientName = this.patientForm.value.PatientName;

      // Convert string date from form to Date object
      if (this.patientForm.value.rendezvous) {
        const dateParts = this.patientForm.value.rendezvous.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed in JS
        const day = parseInt(dateParts[2]);

        // Create date object with local timezone
        this.CurrentPatient.rendezvous = new Date(year, month, day);
      }

      console.log('Updated patient:', this.CurrentPatient);
      this.patientService.updatePatient(this.CurrentPatient);
      console.log('Navigation to patients');
      this.router.navigate(['/patient-list']); // Add forward slash
    } else {
      console.log('Form is not valid', this.patientForm.errors);
      console.log('Form controls errors:', {
        id: this.patientForm.get('PatientId')?.errors,
        name: this.patientForm.get('PatientName')?.errors,
        date: this.patientForm.get('rendezvous')?.errors
      });
    }
  }
  }

