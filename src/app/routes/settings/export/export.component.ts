import { Component, forwardRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { map, delay } from 'rxjs/internal/operators';

import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';

import { AuthService } from '../../../core/auth/auth.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';
import { PluginService } from '../../../core/plugin/plugin.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: [ './export.component.scss' ],
})
export class ExportComponent extends AbstractPageComponent {

  @ViewChild('link') downloadRef: ElementRef;

  password: string;

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private authService: AuthService,
    private pluginService: PluginService,
    private router: Router
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.export.title',
      footer: 'routes.settings.export.export',
      action: () => this.onExport(),
      disabled: () => !this.password || !this.password.length
    });
  }

  onExport(): void {
    this.pluginService.export(this.password)
      .pipe(
        map(blob => URL.createObjectURL(blob)),
      )
      .subscribe(url => {
        this.downloadRef.nativeElement.href = url;
        this.downloadRef.nativeElement.click();
        this.router.navigateByUrl(this.pageConfig.backLink);
      });
  }
}
