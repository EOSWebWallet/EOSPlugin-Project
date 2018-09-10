import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { ScrollbarModule } from 'ngx-scrollbar';

import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: '../routes/dashboard/dashboard.module#DashboardModule' },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatIconModule,
    ScrollbarModule
  ],
  declarations: [
    LayoutComponent,
  ],
  exports: [
    LayoutComponent,
    RouterModule,
  ],
})
export class LayoutModule {}
