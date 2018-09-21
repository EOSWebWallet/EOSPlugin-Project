import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormModule } from '../form/form.module';
import { MatIconModule } from '@angular/material/icon';

import { ToolbarIconComponent } from './icon.component';

@NgModule({
  imports: [
    CommonModule,
    FormModule,
    MatIconModule,
  ],
  declarations: [
    ToolbarIconComponent,
  ],
  exports: [
    ToolbarIconComponent,
  ]
})
export class ToolbarIconModule { }
