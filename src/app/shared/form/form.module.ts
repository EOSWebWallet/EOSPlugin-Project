import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { TextComponent } from './text/text.component';
import { ButtonComponent } from './button/button.component';
import { PasswordComponent } from './password/password.component';
import { IconComponent } from './icon/icon.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  declarations: [
    TextComponent,
    ButtonComponent,
    PasswordComponent,
    IconComponent,
  ],
  exports: [
    TextComponent,
    ButtonComponent,
    PasswordComponent,
    IconComponent
  ],
})
export class FormModule { }
