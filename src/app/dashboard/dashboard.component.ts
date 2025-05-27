
import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from '../models/appointment.model';
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
  appointments: AppointmentModel[] = [];
  todayAppointments: AppointmentModel[] = [];
  stats = {
    totalPatients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  };

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.loadData();
  }

  calculateStats(): void {
    this.stats.totalPatients = this.patients.length;
    this.stats.totalAppointments = this.appointments.length;

    const now = new Date();
    this.stats.upcomingAppointments = this.appointments.filter(
      app => app.date instanceof Date && app.date > now
    ).length;

    this.stats.completedAppointments = this.appointments.filter(
      app => app.status === 'completed'
    ).length;
  }

  loadData(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients: PatientModel[]) => {
        this.patients = patients;

        const storedAppointments = localStorage.getItem('appointments');
        if (storedAppointments) {
          this.appointments = JSON.parse(storedAppointments).map((appointment: any): AppointmentModel => ({
            ...appointment,
            date: appointment.date instanceof Date ? appointment.date : new Date(appointment.date)
          }));

          const today = new Date();
          this.todayAppointments = this.appointments.filter(appointment =>
            appointment.date instanceof Date &&
            appointment.date.toDateString() === today.toDateString()
          );
        } else {
          this.appointments = [];
          this.todayAppointments = [];
        }

        this.calculateStats();
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.patients = [];
        this.appointments = [];
        this.todayAppointments = [];
        this.calculateStats();
      }
    });
  }

  getPatientName(patientId: any): string | undefined {
    const patient = this.patients.find(p => p.Id === patientId);
    return patient ? patient.name : undefined;
  }
}
