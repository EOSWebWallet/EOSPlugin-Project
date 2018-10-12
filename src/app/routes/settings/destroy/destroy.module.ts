import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollbarModule } from 'ngx-scrollbar';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from '../../../shared/shared.module';

import { DestroyComponent } from './destroy.component';

const routes: Routes = [
  {
    path: '',
    component: DestroyComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    MatDialogModule,
    SharedModule,
  ],
  declarations: [
    DestroyComponent,
  ],
})
export class DestroyModule { }
