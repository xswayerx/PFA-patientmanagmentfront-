import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(protected authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  async login(): Promise<void> {
    await this.authService.login();
  }
}
