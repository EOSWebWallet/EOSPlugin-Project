import { NgModule } from '@angular/core';

import { DialogModule } from './dialog/dialog.module';

@NgModule({
  imports: [
    DialogModule,
  ],
  exports: [
    DialogModule,
  ],
})
export class SharedModule { }
