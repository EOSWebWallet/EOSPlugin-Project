import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../shared/shared.module';

import { GenerateComponent } from './generate.component';

const routes: Routes = [
  {
    path: '',
    component: GenerateComponent
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
    GenerateComponent,
  ],
})
export class GenerateModule { }
