import { Component, forwardRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { map, filter, tap } from 'rxjs/internal/operators';

import { IControlErrors } from '../../../shared/form/form.interface';
import { AbstractPageComponent } from '../../../layout/page/page.interface';

import { PageLayoutComponent } from '../../../layout/page/page.component';
import { PluginService } from '../../../core/plugin/plugin.service';
import { DialogService } from 'src/app/shared/dialog/dialog.service';

import { Plugins } from 'src/app/core/plugin/plugin';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: [ './export.component.scss' ],
})
export class ExportComponent extends AbstractPageComponent {
  @ViewChild('passwordControl') passwordControl: FormControl;

  @ViewChild('link') downloadRef: ElementRef;

  password: string;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private pluginService: PluginService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.export.title',
      footer: 'routes.settings.export.export',
      action: () => this.onExport(),
      disabled: () => !this.password || !this.password.length
    });
  }

  get passwordErrors(): IControlErrors {
    return this.passwordControl.touched && this.passwordControl.errors;
  }

  onExport(): void {
    this.pluginService.export(this.password)
      .pipe(
        tap(data => !data && this.dialogService.error('routes.settings.export.failureMessage')),
        filter(Boolean),
        map(exportData => Plugins.createBlob(exportData)),
        map(blob => URL.createObjectURL(blob)),
      )
      .subscribe(url => {
        this.downloadRef.nativeElement.href = url;
        this.downloadRef.nativeElement.click();
        this.router.navigateByUrl(this.pageConfig.backLink);
      });
  }
}
