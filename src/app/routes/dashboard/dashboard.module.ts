import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../shared/shared.module';

import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    TranslateModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    SharedModule,
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
