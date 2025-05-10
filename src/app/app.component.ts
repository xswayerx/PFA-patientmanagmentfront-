import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from './services/auth.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {
  title = 'newProject';
  constructor(public authService: AuthService, public router: Router) {}

  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  // logout() {
  //   this.authService.logout();
  // }
}
export class NameEditorComponent {
  name = new FormControl('');

}
