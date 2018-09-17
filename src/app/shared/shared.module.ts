import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from './dialog/dialog.module';
import { FormModule } from './form/form.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    FormModule,
  ],
  exports: [
    CommonModule,
    DialogModule,
    FormModule,
  ],
})
export class SharedModule { }
