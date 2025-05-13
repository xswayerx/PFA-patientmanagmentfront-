// src/app/models/appointment.model.ts
export class AppointmentModel {
  id?: string;
  patientId?: string;
  date?: Date;
  time?: string;
  duration?: number;
  type?: string;
  notes?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}
