import { Component, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { IControlErrors } from '../../shared/form/form.interface';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
})
export class LoginComponent {

  @ViewChild('password')
  passwordControl: FormControl;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  get passwordErrors(): IControlErrors {
    return this.passwordControl.touched && this.passwordControl.errors;
  }

  onLogin(): void {
    this.authService.login(this.passwordControl.value);
  }
}
