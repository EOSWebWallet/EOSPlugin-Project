import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { TextComponent } from './text/text.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  declarations: [
    TextComponent,
    ButtonComponent,
  ],
  exports: [
    TextComponent,
    ButtonComponent,
  ]
})
export class FormModule { }
