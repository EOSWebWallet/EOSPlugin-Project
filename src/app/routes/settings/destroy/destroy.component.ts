import { Component, forwardRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/internal/operators';

import { AbstractPageComponent } from '../../../layout/page/page.interface';

import { AuthService } from '../../../core/auth/auth.service';
import { DialogService } from '../../../shared/dialog/dialog.service';

import { PageLayoutComponent } from '../../../layout/page/page.component';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm/confirm-dialog.component';

@Component({
  selector: 'app-destroy',
  templateUrl: './destroy.component.html',
  styleUrls: [ './destroy.component.scss' ],
})
export class DestroyComponent extends AbstractPageComponent {

  constructor(
    @Inject(forwardRef(() => PageLayoutComponent)) pageLayout: PageLayoutComponent,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {
    super(pageLayout, {
      backLink: '/app/settings',
      header: 'routes.settings.destroy.title',
      footer: 'routes.settings.destroy.destroy',
      action: () => this.onDestroy()
    });
  }

  onDestroy(): void {
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
