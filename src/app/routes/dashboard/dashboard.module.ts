import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule
  ],
  declarations: [
    DashboardComponent,
  ],
})
export class DashboardModule { }
