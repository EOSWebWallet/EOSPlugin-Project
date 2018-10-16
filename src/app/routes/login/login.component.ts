import { Component, ViewChildren, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { filter } from 'rxjs/internal/operators';

import { IControlErrors } from '../../shared/form/form.interface';
import { AuthService } from '../../core/auth/auth.service';
import { DialogService } from '../../shared/dialog/dialog.service';

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
    private dialogService: DialogService
  ) { }

  get passwordErrors(): IControlErrors {
    return this.passwordControl.touched && this.passwordControl.errors;
  }

  onLogin(): void {
    this.authService.login(this.passwordControl.value);
  }

  onDestroy(event: any): void {
    event.preventDefault();
    this.dialogService.confirm('routes.settings.destroy.confirmMessage')
      .pipe(
        filter(Boolean)
      )
      .subscribe(() => {
        this.authService.destroy();
        this.dialogService.info('routes.settings.destroy.successMessage')
          .subscribe(() => this.router.navigateByUrl(AuthService.PATH_REGISTER));
      });
  }
}
