import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../shared/form/form.module';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollbarModule } from 'ngx-scrollbar';

import { SignatureComponent } from './signature.component';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    TranslateModule,
    FormModule,
    MatDividerModule,
    ScrollbarModule,
  ],
  declarations: [
    SignatureComponent,
  ],
  exports: [
    SignatureComponent,
  ],
})
export class SignatureModule { }
