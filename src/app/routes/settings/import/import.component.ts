import { Component, forwardRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { filter, flatMap } from 'rxjs/internal/operators';
import { of } from 'rxjs/internal/observable/of';

import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';
import { IFile } from '../../../shared/form/file/file.interface';
import { IControlErrors } from '../../../shared/form/form.interface';

import { AuthService } from '../../../core/auth/auth.service';
import { PluginService } from '../../../core/plugin/plugin.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: [ './import.component.scss' ],
})
export class ImportComponent extends AbstractPageComponent {
  @ViewChild('passwordControl')
  passwordControl: FormControl;

  password: string;

  file: IFile;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private authService: AuthService,
    private pluginService: PluginService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.import.title',
      footer: 'routes.settings.import.import',
      action: () => this.onImport(),
      disabled: () => !this.password || !this.password.length || !this.file
    });
  }

  get passwordErrors(): IControlErrors {
    return this.passwordControl.touched && this.passwordControl.errors;
  }

  onSelect(file: IFile): void {
    this.file = file;
  }

  onImport(): void {
    this.dialogService.confirm('routes.settings.import.confirmMessage')
      .pipe(
        filter(Boolean),
        flatMap(() => this.pluginService.import(this.password, this.file)),
        flatMap(result => result ? of(result) : this.dialogService.error('routes.settings.import.failureMessage'))
      )
      .subscribe(() => this.router.navigateByUrl(this.pageConfig.backLink));
  }
}
