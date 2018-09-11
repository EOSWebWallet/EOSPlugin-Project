import { NgModule } from '@angular/core';

import { DialogModule } from './dialog/dialog.module';
import { FormModule } from './form/form.module';

@NgModule({
  imports: [
    DialogModule,
    FormModule,
  ],
  exports: [
    DialogModule,
    FormModule,
  ],
})
export class SharedModule { }
