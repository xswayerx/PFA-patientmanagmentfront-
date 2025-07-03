import {PatientModel} from './patient.model';

export interface AppointmentModel {
  id: number;
  patientId: number;
  date: Date;
  time: string; // format HH:mm
  status: 'upcoming' | 'completed' | 'cancelled';
  reason?: string; // optionnel : motif du rendez-vous
  notes?: string;  // optionnel : remarques du médecin
}
