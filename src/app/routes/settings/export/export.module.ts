import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollbarModule } from 'ngx-scrollbar';

import { SharedModule } from '../../../shared/shared.module';

import { ExportComponent } from './export.component';

const routes: Routes = [
  {
    path: '',
    component: ExportComponent
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
    ExportComponent,
  ],
})
export class ExportModule { }
