// src/app/models/appointment.model.ts
export class AppointmentModel {
  id?: string;
  Id?: string;
  date?: Date;
  time?: string;
  duration?: number;
  type?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}
