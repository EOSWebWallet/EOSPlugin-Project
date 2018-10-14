import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { FormModule } from '../form/form.module';

import { DialogService } from './dialog.service';

import { InfoDialogComponent } from './info/info-dialog.component';
import { ConfirmDialogComponent } from './confirm/confirm-dialog.component';
import { ErrorDialogComponent } from './error/error-dialog.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    FormModule
  ],
  declarations: [
    ConfirmDialogComponent,
    InfoDialogComponent,
    ErrorDialogComponent
  ],
  exports: [
    ConfirmDialogComponent,
    InfoDialogComponent,
    ErrorDialogComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    InfoDialogComponent,
    ErrorDialogComponent
  ],
  providers: [
    DialogService
  ]
})
export class DialogModule { }
