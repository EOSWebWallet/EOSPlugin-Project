import { Component, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { IControlErrors } from '../../shared/form/form.interface';
import { AuthService } from '../../core/auth/auth.service';
import { PluginService } from '../../core/plugin/plugin.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
})
export class RegistrationComponent {

  @ViewChild('password')
  passwordControl: FormControl;

  @ViewChild('passwordConfirm')
  passwordConfirmControl: FormControl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private pluginService: PluginService
  ) { }

  get passwordErrors(): IControlErrors {
    return this.passwordControl.touched && this.passwordControl.errors;
  }

  get passwordConfirmErrors(): IControlErrors {
    return this.passwordConfirmControl.touched && this.passwordConfirmControl.errors
      || this.passwordEqualityError;
  }

  get passwordEqualityError(): IControlErrors {
    return this.passwordControl.value && this.passwordConfirmControl.value
      && this.passwordControl.value !== this.passwordConfirmControl.value
        ? { passwordEquality: true } : null;
  }

  onRegister(): void {
    this.authService.register(this.passwordControl.value)
      .subscribe(password => {
        this.pluginService.createInstance(password);
        this.router.navigateByUrl('/app/home');
      });
  }
}
