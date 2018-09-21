import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ScrollbarModule, ScrollbarComponent } from 'ngx-scrollbar';
import { MatDividerModule } from '@angular/material/divider';

import { SharedModule } from '../../shared/shared.module';

import { PageComponent } from './page.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ScrollbarModule,
    MatDividerModule,
    SharedModule
  ],
  declarations: [
    PageComponent,
  ],
  exports: [
    ScrollbarComponent,
    PageComponent,
  ]
})
export class PageModule { }
