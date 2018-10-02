import { Component, forwardRef, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { IPageConfig, AbstractPageComponent } from '../../../layout/page/page.interface';

import { AuthService } from '../../../core/auth/auth.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';

@Component({
  selector: 'app-destroy',
  templateUrl: './destroy.component.html',
  styleUrls: [ './destroy.component.scss' ],
})
export class DestroyComponent extends AbstractPageComponent {

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private authService: AuthService,
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.destroy.title',
      footer: 'routes.settings.destroy.destroy',
      action: () => this.onDestroy()
    });
  }

  onDestroy(): void {
    this.authService.destroy();
  }
}
