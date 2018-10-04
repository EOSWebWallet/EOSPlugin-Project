import { Component, forwardRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { map, delay } from 'rxjs/internal/operators';

import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';

import { AuthService } from '../../../core/auth/auth.service';

import { IFile } from '../../../shared/form/file/file.interface';

import { PluginService } from '../../../core/plugin/plugin.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: [ './import.component.scss' ],
})
export class ImportComponent extends AbstractPageComponent {

  password: string;

  file: IFile;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private authService: AuthService,
    private pluginService: PluginService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.import.title',
      footer: 'routes.settings.import.import',
      action: () => this.onImport(),
      disabled: () => !this.password || !this.password.length || !this.file
    });
  }

  onSelect(file: IFile): void {
    this.file = file;
  }

  onImport(): void {
    this.pluginService.import(this.password, this.file);
  }
}