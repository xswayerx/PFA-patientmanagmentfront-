import {PatientModel} from './patient.model';

export interface AppointmentModel {
  id: number;
  patientId: number;
  date: Date;
  time: string; // format HH:mm
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  notes?: string;
}
