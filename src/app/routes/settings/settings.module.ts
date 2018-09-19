import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared.module';
import { NetworksModule } from './networks/networks.module';

import { SettingsComponent } from './settings.component';
import { NetworksComponent } from './networks/networks.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule,
  ],
  declarations: [
    SettingsComponent,
  ],
})
export class SettingsModule { }