import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { ExtensionMessageService } from './message/message.service';

@NgModule({
  providers: [
    AuthService,
    ExtensionMessageService,
  ],
})
export class CoreModule { }
