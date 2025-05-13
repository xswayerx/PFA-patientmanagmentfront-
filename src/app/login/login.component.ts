import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import {Router, RouterOutlet} from "@angular/router";
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public loginError = false;

  constructor(private fb: FormBuilder, protected authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: this.fb.control(''),
      password: this.fb.control('')
    });
  }

  login(): void {
    let username = this.loginForm.value.username;
    let password = this.loginForm.value.password;
    let auth: boolean = this.authService.login(username, password);
    if (auth) {
      // Navigate to patient-list instead of admin since that route exists
      this.router.navigateByUrl("/dashboard");
    } else {
      this.loginError = true;
    }
  }

  logout() {
    this.authService.logout();
  }
}
