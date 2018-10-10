import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDividerModule } from '@angular/material/divider';

import { SharedModule } from '../../../../shared/shared.module';

import { ConfirmComponent } from './confirm.component';

const routes: Routes = [
  {
    path: '',
    component: ConfirmComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    MatDividerModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [
    ConfirmComponent,
  ],
})
export class ConfirmModule { }
