import { Component, forwardRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, delay } from 'rxjs/internal/operators';

import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';
import { IControlErrors } from '../../../shared/form/form.interface';

import { AuthService } from '../../../core/auth/auth.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-password-change',
  templateUrl: './password.component.html',
  styleUrls: [ './password.component.scss' ],
})
export class PasswordComponent extends AbstractPageComponent {

  @ViewChild('form') passwordForm: FormGroup;

  @ViewChild('password')
  passwordControl: FormControl;

  @ViewChild('newPassword')
  newPasswordControl: FormControl;

  @ViewChild('newPasswordConfirm')
  newPasswordConfirmControl: FormControl;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private authService: AuthService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.password.title',
      footer: 'routes.settings.password.change',
      action: () => this.onChange(),
      disabled: () => !this.isValid
    });
  }

  get passwordErrors(): IControlErrors {
    return this.passwordControl.touched && this.passwordControl.errors;
  }

  get newPasswordErrors(): IControlErrors {
    return this.newPasswordControl.touched && this.newPasswordControl.errors;
  }

  get newPasswordConfirmErrors(): IControlErrors {
    return this.newPasswordConfirmControl.touched && this.newPasswordConfirmControl.errors
      || this.passwordEqualityError;
  }

  get passwordEqualityError(): IControlErrors {
    return this.newPasswordControl.value && this.newPasswordConfirmControl.value
      && this.newPasswordControl.value !== this.newPasswordConfirmControl.value
        ? { passwordEquality: true } : null;
  }

  onChange(): void {
    const passwod = this.passwordForm.controls['password'].value;
    const newPassword = this.passwordForm.controls['newPassword'].value;
    this.authService.changePassword(passwod, newPassword);
    this.dialogService.info('routes.settings.password.successMessage')
      .subscribe(() => this.router.navigateByUrl(this.pageConfig.backLink));
  }

  private get isValid(): boolean {
    return this.passwordForm && Object.keys(this.passwordForm.controls).length && this.passwordForm.valid
      && this.passwordForm.controls['newPassword'].value === this.passwordForm.controls['newPasswordConfirm'].value;
  }
}
