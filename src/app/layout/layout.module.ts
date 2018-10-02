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
import { NetworksModule } from '../routes/settings/networks/networks.module';
import { DestroyModule } from '../routes/settings/destroy/destroy.module';
import { AccountsModule } from '../routes/keys/accounts/accounts.module';
import { AccountModule } from '../routes/keys/accounts/account/account.module';
import { SharedModule } from '../shared/shared.module';
import { PageModule } from './page/page.module';

import { AuthService } from '../core/auth/auth.service';

import { LayoutComponent } from './layout.component';
import { AccountsComponent } from '../routes/keys/accounts/accounts.component';
import { AccountComponent } from '../routes/keys/accounts/account/account.component';
import { DestroyComponent } from '../routes/settings/destroy/destroy.component';
import { DashboardComponent } from '../routes/dashboard/dashboard.component';
import { KeysComponent } from '../routes/keys/keys.component';
import { NetworksComponent } from '../routes/settings/networks/networks.component';
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
      { path: 'keys/accounts', component: AccountsComponent },
      { path: 'keys/accounts/account', component: AccountComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'settings/networks', component: NetworksComponent },
      { path: 'settings/destroy', component: DestroyComponent },
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
    NetworksModule,
    DestroyModule,
    AccountsModule,
    AccountModule,
    SharedModule,
    PageModule
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
