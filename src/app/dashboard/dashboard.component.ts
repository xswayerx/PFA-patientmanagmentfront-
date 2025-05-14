// src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { PatientModel } from '../models/patient.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardComponent implements OnInit {
  patients: PatientModel[] = [];
  appointments: any[] = []; // Use proper appointment interface/model
  todayAppointments: any[] = [];
  stats = {
    totalPatients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  };

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadData();
    this.calculateStats();
  }

  loadData(): void {
    // Load patients
    this.patientService.getAllPatients().subscribe((patients: any[]) => {
      this.patients = patients;
    });
    // Load appointments from localStorage
    const storedAppointments = localStorage.getItem('appointments');
    if (storedAppointments) {
      this.appointments = JSON.parse(storedAppointments).map((appointment: any) => ({
        ...appointment,
        date: new Date(appointment.date)
      }));

      // Filter today's appointments
      const today = new Date();
      this.todayAppointments = this.appointments.filter(appointment =>
        appointment.date.toDateString() === today.toDateString()
      );
    }
  }

  calculateStats(): void {
    this.stats.totalPatients = this.patients.length;
    this.stats.totalAppointments = this.appointments.length;

    const now = new Date();
    this.stats.upcomingAppointments = this.appointments.filter(
      app => new Date(app.date) > now
    ).length;

    this.stats.completedAppointments = this.appointments.filter(
      app => app.status === 'completed'
    ).length;
  }


  getPatientName(patientId: any): string | undefined {
      const patient = this.patients.find(p => p.Id === patientId);
      if (patient) {
        return patient.name;
      }
      return undefined;
    }

  }

