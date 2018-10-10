import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../shared/form/form.module';
import { MatDividerModule } from '@angular/material/divider';

import { SignatureComponent } from './signature.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormModule,
    MatDividerModule,
  ],
  declarations: [
    SignatureComponent,
  ],
  exports: [
    SignatureComponent,
  ],
})
export class SignatureModule { }
