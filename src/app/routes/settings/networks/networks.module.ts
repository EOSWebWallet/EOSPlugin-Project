import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
    TranslateModule,
    SharedModule,
  ],
  declarations: [
    NetworksComponent,
  ],
})
export class NetworksModule { }
