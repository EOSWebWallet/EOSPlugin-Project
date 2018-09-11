import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { TextComponent } from './text/text.component';

@NgModule({
  imports: [
    FormsModule,
    MatInputModule
  ],
  declarations: [
    TextComponent,
  ],
  exports: [
    TextComponent,
  ]
})
export class FormModule { }
