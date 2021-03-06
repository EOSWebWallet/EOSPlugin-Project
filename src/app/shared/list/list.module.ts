import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../form/form.module';

import { ListComponent } from './list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatDividerModule,
    TranslateModule,
    FormModule,
  ],
  declarations: [
    ListComponent,
  ],
  exports: [
    ListComponent,
  ]
})
export class ListModule { }
