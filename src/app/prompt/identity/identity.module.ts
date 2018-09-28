import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule } from '../../shared/form/form.module';

import { IdentityPromptService } from './identity.service';

import { IdentityComponent } from './identity.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormModule,
  ],
  declarations: [
    IdentityComponent,
  ],
  exports: [
    IdentityComponent,
  ],
  providers: [
    IdentityPromptService
  ]
})
export class IdentityModule { }
