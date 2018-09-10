import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { InfoDialogComponent } from './info/info-dialog.component';

@NgModule({
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ],
  declarations: [
    InfoDialogComponent,
  ],
  exports: [
    InfoDialogComponent,
  ],
  entryComponents: [
    InfoDialogComponent,
  ]
})
export class DialogModule { }
