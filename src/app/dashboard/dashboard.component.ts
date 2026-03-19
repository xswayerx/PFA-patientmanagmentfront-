import { Component, OnInit } from '@angular/core';
import { AppointmentModel } from '../models/appointment.model';
import { CommonModule } from '@angular/common';
import { PatientService } from '../services/patient.service';
import { PatientModel } from '../models/patient.model';
import {AppointmentService} from '../services/appointment.service';

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
    scheduledAppointments: 0,
    completedAppointments: 0
  };

constructor(
  private patientService: PatientService,
  private appointmentService: AppointmentService
) {}



  ngOnInit(): void {
    this.loadData();
  }

  calculateStats(): void {
    this.stats.totalPatients = this.patients.length;
    this.stats.totalAppointments = this.appointments.length;
    this.stats.scheduledAppointments = this.appointments.filter(
      app => app.status === 'scheduled'
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
          this.calculateStats();
        } else {
          // Fetch from backend if local storage is empty
          this.appointmentService.getAllAppointments().subscribe({
            next: (data: AppointmentModel[]) => {
              this.appointments = data.map((appointment: any): AppointmentModel => ({
                ...appointment,
                date: appointment.date instanceof Date ? appointment.date : new Date(appointment.date)
              }));
              const today = new Date();
              this.todayAppointments = this.appointments.filter(appointment =>
                appointment.date instanceof Date &&
                appointment.date.toDateString() === today.toDateString()
              );
              this.calculateStats();
            },
            error: (err) => {
              console.error('Error loading appointments:', err);
              this.appointments = [];
              this.todayAppointments = [];
              this.calculateStats();
            }
          });
        }
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

  getPatientName(patientId: number | undefined | null): string {
    if (patientId == null) return 'Unknown';
    const patient = this.patients.find(p => Number(p.Id) === Number(patientId));
    return patient?.name || 'Unknown';
  }
}
