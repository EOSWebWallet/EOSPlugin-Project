import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogModule } from './dialog/dialog.module';
import { FormModule } from './form/form.module';
import { NavListModule } from './nav-list/list.module';
import { HeaderModule } from './header/header.module';
import { FooterModule } from './footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    FormModule,
    NavListModule,
  ],
  exports: [
    CommonModule,
    DialogModule,
    FormModule,
    NavListModule,
    HeaderModule,
    FooterModule,
  ],
})
export class SharedModule { }
