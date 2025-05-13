// src/app/services/patient.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // getPatientById(id: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${id}`);
  // }

  createPatient(patient: any): Observable<any> {
    return this.http.post(this.apiUrl, patient);
  }

  updatePatient(id: string | undefined, patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: string | undefined): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
