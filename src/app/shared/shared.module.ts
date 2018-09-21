import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from './dialog/dialog.module';
import { FormModule } from './form/form.module';
import { ListModule } from './list/list.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    FormModule,
    ListModule,
  ],
  exports: [
    CommonModule,
    DialogModule,
    FormModule,
    ListModule,
  ],
})
export class SharedModule { }
