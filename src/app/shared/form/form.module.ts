import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TextComponent } from './text/text.component';
import { ButtonComponent } from './button/button.component';
import { PasswordComponent } from './password/password.component';
import { IconComponent } from './icon/icon.component';
import { SelectComponent } from './select/select.component';
import { ToolbarIconComponent } from './icon/toolbar/icon.component';
import { FileComponent } from './file/file.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatAutocompleteModule,
  ],
  declarations: [
    TextComponent,
    ButtonComponent,
    PasswordComponent,
    IconComponent,
    ToolbarIconComponent,
    SelectComponent,
    FileComponent,
  ],
  exports: [
    TextComponent,
    ButtonComponent,
    PasswordComponent,
    IconComponent,
    SelectComponent,
    ToolbarIconComponent,
    FileComponent,
  ],
})
export class FormModule { }
