import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { FormModule } from '../form/form.module';

import { InfoDialogComponent } from './info/info-dialog.component';
import { ConfirmDialogComponent } from './confirm/confirm-dialog.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    FormModule
  ],
  declarations: [
    ConfirmDialogComponent,
    InfoDialogComponent,
  ],
  exports: [
    ConfirmDialogComponent,
    InfoDialogComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
    InfoDialogComponent,
  ]
})
export class DialogModule { }
