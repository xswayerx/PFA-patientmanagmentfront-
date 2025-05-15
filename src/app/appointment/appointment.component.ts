import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '../services/patient.service';
import { AppointmentService } from '../services/appointment.service';
import { PatientModel } from '../models/patient.model';
import { DatePipe } from '@angular/common';

interface Appointment {
  id: string;
  Id: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [DatePipe]
})
export class AppointmentComponent implements OnInit {
  patients: PatientModel[] = [];
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];

  isAddDialogOpen: boolean = false;
  isEditDialogOpen: boolean = false;
  isDeleteDialogOpen: boolean = false;

  activeTab: string = 'upcoming';
  selectedAppointment: Appointment | null = null;
  selectedPatient: PatientModel | null = null;

  appointmentForm: FormGroup;

  appointmentTypes = ['Check-up', 'Follow-up', 'Consultation', 'Emergency', 'Procedure', 'Vaccination'];
  timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  durations = [15, 30, 45, 60, 90, 120];

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.appointmentForm = this.fb.group({
      id: [''],
      Id: ['', Validators.required],
      date: ['', Validators.required],
      time: ['09:00', Validators.required],
      duration: [30],
      type: ['Check-up'],
      notes: [''],
      status: ['scheduled']
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadAppointments();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (patients: PatientModel[]) => {
        this.patients = patients;
        this.filterAppointments();
      },
      error: (err) => {
        console.error('Error fetching patients:', err);
      }
    });
  }

  loadAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data || [];
        this.filterAppointments();
      },
      error: (err) => {
        console.error('Error fetching appointments:', err);
        this.appointments = [];
      }
    });
  }

  addAppointment(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    const newAppointment = this.appointmentForm.value;

    // Validate patient existence
    const patientExists = this.patients.some(patient => patient.Id === newAppointment.Id);
    if (!patientExists) {
      alert('Invalid patient selected. Please select a valid patient.');
      return;
    }

    if (!this.isTimeSlotAvailable(newAppointment)) {
      alert('This time slot conflicts with an existing appointment.');
      return;
    }

    this.appointmentService.createAppointment(newAppointment).subscribe({
      next: (response) => {
        console.log('Appointment created:', response);
        this.loadAppointments();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error creating appointment:', err);
      }
    });
  }

  updateAppointment(): void {
    if (this.appointmentForm.invalid) {
      return;
    }

    const updatedAppointment = this.appointmentForm.value;
    const patientExists = this.patients.some(patient => patient.Id === updatedAppointment.Id);
    if (!patientExists) {
      alert('Invalid patient selected. Please select a valid patient.');
      return;
    }
    if (!this.isTimeSlotAvailable(updatedAppointment)) {
      alert('This time slot conflicts with an existing appointment.');
      return;
    }

    this.appointmentService.updateAppointment(updatedAppointment.id, updatedAppointment).subscribe({
      next: (response) => {
        console.log('Appointment updated:', response);
        this.loadAppointments();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error updating appointment:', err);
      }
    });
  }

  deleteAppointment(): void {
    if (!this.selectedAppointment?.id) {
      console.error('No valid appointment ID provided for deletion.');
      return;
    }

    this.appointmentService.deleteAppointment(this.selectedAppointment.id).subscribe({
      next: () => {
        console.log('Appointment deleted successfully');
        this.loadAppointments();
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error deleting appointment:', err);
      }
    });
  }

  updateAppointmentStatus(appointment: Appointment, status: 'scheduled' | 'completed' | 'cancelled'): void {
    const index = this.appointments.findIndex(a => a.id === appointment.id);
    if (index !== -1) {
      this.appointments[index].status = status;
      this.filterAppointments();
    }
  }

  filterAppointments(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (this.activeTab) {
      case 'upcoming':
        this.filteredAppointments = this.appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= today;
        });
        break;
      case 'today':
        this.filteredAppointments = this.appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          return this.isToday(appointmentDate);
        });
        break;
      case 'past':
        this.filteredAppointments = this.appointments.filter(appointment => {
          const appointmentDate = new Date(appointment.date);
          appointmentDate.setHours(0, 0, 0, 0);
          return appointmentDate < today;
        });
        break;
      case 'patient':
        if (this.selectedPatient) {
          this.filteredAppointments = this.appointments.filter(appointment =>
            appointment.Id === this.selectedPatient?.Id
          );
        }
        break;
      default:
        this.filteredAppointments = [...this.appointments];
    }

    this.filteredAppointments.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
    this.filterAppointments();
  }

  openAddDialog(): void {
    const today = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';

    this.appointmentForm.reset({
      id: '',
      Id: this.selectedPatient ? this.selectedPatient.Id : '',
      date: today,
      time: '09:00',
      duration: 30,
      type: 'Check-up',
      notes: '',
      status: 'scheduled'
    });

    this.isAddDialogOpen = true;
  }

  openEditDialog(appointment: Appointment): void {
    const patientExists = this.patients.some(patient => patient.Id === appointment.Id);

    if (!patientExists) {
      console.error(`No patient found with Id: ${appointment.Id}`);
      appointment.Id = ''; // Set to a default value if no matching patient is found
    }

    this.appointmentForm.patchValue({
      id: appointment.id,
      Id: appointment.Id || '', // Provide a default value if Id is null or undefined
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      notes: appointment.notes,
      status: appointment.status
    });

    this.isEditDialogOpen = true;
  }

  openDeleteDialog(appointment: Appointment): void {
    this.selectedAppointment = appointment;
    this.isDeleteDialogOpen = true;
  }

  isTimeSlotAvailable(appointment: Appointment, excludeId?: string): boolean {
    return !this.appointments.some(a =>
      a.id !== excludeId &&
      a.date === appointment.date &&
      a.time === appointment.time
    );
  }

  getPatientName(Id: string): string {
    const patient = this.patients.find(p => p.Id === Id);
    // @ts-ignore
    return <string>patient ? patient.name : 'Unknown Patient';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'text-success';
      case 'cancelled': return 'text-danger';
      case 'scheduled': return 'text-primary';
      default: return '';
    }
  }

  closeDialog(): void {
    this.isAddDialogOpen = false;
    this.isEditDialogOpen = false;
    this.isDeleteDialogOpen = false;
  }
}
