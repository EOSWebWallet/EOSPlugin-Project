import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../form/form.module';

import { NavHeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormModule,
  ],
  declarations: [
    NavHeaderComponent,
  ],
  exports: [
    NavHeaderComponent,
  ]
})
export class NavHeaderModule { }
