// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { PatientModel } from './models/patient.model';
import { PatientService } from './services/patient.service';

interface Appointment {
  id: string;
  patientId: string;
  date: Date;
  time: string;
  reason: string;
  status: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink]
})
export class AppComponent implements OnInit {
  title = 'newProject';
  patients: PatientModel[] = [];
  appointments: Appointment[] = [];
  selectedPatient: PatientModel | null = null;
  activeTab: string = 'dashboard';
  currentUrl: string = '';

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });
  }

  ngOnInit(): void {
    this.loadData();

    // Set active tab based on route
    if (this.currentUrl.includes('patient-list')) {
      this.activeTab = 'patients';
    } else if (this.currentUrl.includes('appointments')) {
      this.activeTab = 'appointments';
    } else {
      this.activeTab = 'dashboard';
    }
  }

  loadData(): void {
    // Load patients
    this.patients = this.patientService.getPatients();

    // Load appointments from localStorage
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      this.appointments = JSON.parse(storedAppointments).map((appointment: any) => ({
        ...appointment,
        date: new Date(appointment.date)
      }));
    } else {
      // Initialize with some default appointments if needed
      this.appointments = [];
    }
  }

  isLoginPage(): boolean {
    return this.currentUrl.includes('login');
  }

  handleSelectPatient(patient: PatientModel): void {
    this.selectedPatient = patient;
    this.router.navigate(['appointments']);
  }

  clearSelectedPatient(): void {
    this.selectedPatient = null;
  }

  navigateToTab(tab: string): void {
    this.activeTab = tab;

    switch (tab) {
      case 'dashboard':
        this.router.navigate(['dashboard']);
        break;
      case 'patients':
        this.router.navigate(['patient-list']);
        break;
      case 'appointments':
        this.router.navigate(['appointments']);
        break;
    }
  }
}
