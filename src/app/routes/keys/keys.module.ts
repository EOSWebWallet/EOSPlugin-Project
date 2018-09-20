import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { KeysComponent } from './keys.component';

const routes: Routes = [
  {
    path: '',
    component: KeysComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    KeysComponent,
  ],
})
export class KeysModule { }
