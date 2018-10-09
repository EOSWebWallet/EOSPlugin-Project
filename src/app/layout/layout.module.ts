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
import { ExportModule } from '../routes/settings/export/export.module';
import { ImportModule } from '../routes/settings/import/import.module';
import { PasswordModule } from '../routes/settings/password/password.module';
import { AboutModule } from '../routes/settings/about/about.module';
import { GenerateModule } from '../routes/keys/generate/generate.module';
import { LanguageModule } from '../routes/settings/language/language.module';
import { SendModule } from '../routes/dashboard/send/send.module';
import { ConfirmModule } from '../routes/dashboard/send/confirm/confirm.module';

import { AuthService } from '../core/auth/auth.service';

import { LayoutComponent } from './layout.component';
import { AccountsComponent } from '../routes/keys/accounts/accounts.component';
import { AccountComponent } from '../routes/keys/accounts/account/account.component';
import { DestroyComponent } from '../routes/settings/destroy/destroy.component';
import { DashboardComponent } from '../routes/dashboard/dashboard.component';
import { KeysComponent } from '../routes/keys/keys.component';
import { NetworksComponent } from '../routes/settings/networks/networks.component';
import { SettingsComponent } from '../routes/settings/settings.component';
import { ExportComponent } from '../routes/settings/export/export.component';
import { ImportComponent } from '../routes/settings/import/import.component';
import { PasswordComponent } from '../routes/settings/password/password.component';
import { AboutComponent } from '../routes/settings/about/about.component';
import { GenerateComponent } from '../routes/keys/generate/generate.component';
import { LanguageComponent } from '../routes/settings/language/language.component';
import { SendComponent } from '../routes/dashboard/send/send.component';
import { ConfirmComponent } from '../routes/dashboard/send/confirm/confirm.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [ AuthService ],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardComponent },
      { path: 'home/send', component: SendComponent },
      { path: 'home/send/confirm', component: ConfirmComponent },
      { path: 'keys', component: KeysComponent },
      { path: 'keys/accounts', component: AccountsComponent },
      { path: 'keys/generate', component: GenerateComponent },
      { path: 'keys/accounts/account', component: AccountComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'settings/networks', component: NetworksComponent },
      { path: 'settings/destroy', component: DestroyComponent },
      { path: 'settings/destroy', component: DestroyComponent },
      { path: 'settings/export', component: ExportComponent },
      { path: 'settings/import', component: ImportComponent },
      { path: 'settings/password', component: PasswordComponent },
      { path: 'settings/about', component: AboutComponent },
      { path: 'settings/language', component: LanguageComponent },
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
    PageModule,
    ExportModule,
    ImportModule,
    PasswordModule,
    AboutModule,
    GenerateModule,
    LanguageModule,
    SendModule,
    ConfirmModule,
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
