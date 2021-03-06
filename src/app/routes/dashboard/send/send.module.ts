import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../shared/shared.module';

import { SendService } from './send.service';

import { SendComponent } from './send.component';

const routes: Routes = [
  {
    path: '',
    component: SendComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule,
    FormsModule,
    SharedModule,
  ],
  declarations: [
    SendComponent,
  ],
  providers: [
    SendService,
  ]
})
export class SendModule { }
