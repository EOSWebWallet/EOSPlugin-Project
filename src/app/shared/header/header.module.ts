import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../form/form.module';

import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormModule,
  ],
  declarations: [
    HeaderComponent,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class HeaderModule { }
