import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../shared/shared.module';
import { AccountsComponent } from './accounts.component';


const routes: Routes = [
  {
    path: '',
    component: AccountsComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    MatListModule,
    MatDividerModule,
    TranslateModule,
    SharedModule,
  ],
  declarations: [
    AccountsComponent,
  ],
})
export class AccountsModule { }
