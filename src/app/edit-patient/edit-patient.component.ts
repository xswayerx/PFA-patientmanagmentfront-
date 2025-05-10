import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
      private patientservice: PatientService,
      private router: Router
    ) {}

    ngOnInit(): void {
      this.CurrentPatient = this.patientservice.editPatient(
        this.activatedRoute.snapshot.params['id']
      );
    }

    updatePatient(): void {
      this.patientservice.updatePatient(this.CurrentPatient);
      this.router.navigate(['products']);
    }

  }
