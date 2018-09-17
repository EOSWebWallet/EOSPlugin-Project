import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../shared/shared.module';

import { NetworksComponent } from './networks.component';

const routes: Routes = [
  {
    path: '',
    component: NetworksComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    MatListModule,
    MatDividerModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [
    NetworksComponent,
  ],
})
export class NetworksModule { }
