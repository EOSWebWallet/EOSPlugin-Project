import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollbarModule } from 'ngx-scrollbar';

import { DashboardModule } from '../routes/dashboard/dashboard.module';
import { KeysModule } from '../routes/keys/keys.module';
import { SettingsModule } from '../routes/settings/settings.module';

import { AuthService } from '../core/auth/auth.service';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../routes/dashboard/dashboard.component';
import { KeysComponent } from '../routes/keys/keys.component';
import { SettingsComponent } from '../routes/settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'keys', component: KeysComponent },
      { path: 'settings', component: SettingsComponent },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    ScrollbarModule,
    DashboardModule,
    KeysModule,
    SettingsModule,
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
