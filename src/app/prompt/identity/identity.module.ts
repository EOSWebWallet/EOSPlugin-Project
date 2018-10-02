import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../shared/form/form.module';
import { ScrollbarModule } from 'ngx-scrollbar';
import { MatDividerModule } from '@angular/material/divider';

import { IdentityComponent } from './identity.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormModule,
    ScrollbarModule,
    MatDividerModule,
  ],
  declarations: [
    IdentityComponent,
  ],
  exports: [
    IdentityComponent,
  ],
})
export class IdentityModule { }
