import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../form/form.module';
import { MatDividerModule } from '@angular/material/divider';

import { FooterComponent } from './footer.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormModule,
    MatDividerModule
  ],
  declarations: [
    FooterComponent,
  ],
  exports: [
    FooterComponent,
  ]
})
export class FooterModule { }
