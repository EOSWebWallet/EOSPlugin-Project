import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../shared/shared.module';

import { LanguageComponent } from './language.component';

const routes: Routes = [
  {
    path: '',
    component: LanguageComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [
    LanguageComponent,
  ],
})
export class LanguageModule { }
