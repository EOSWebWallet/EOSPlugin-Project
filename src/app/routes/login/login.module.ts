import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './login.component';

@NgModule({
  imports: [
    FormsModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [
    LoginComponent,
  ],
})
export class LoginModule { }
