import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { ExtensionMessageService } from './message/message.service';
import { SettingsService } from './settings/settings.service';
import { NetworksService } from './network/networks.service';

@NgModule({
  providers: [
    AuthService,
    ExtensionMessageService,
    SettingsService,
    NetworksService,
  ],
})
export class CoreModule { }
