import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { ExtensionMessageService } from './message/message.service';
import { SettingsService } from './settings/settings.service';
import { NetworksService } from './network/networks.service';
import { AccountService } from './account/account.service';

@NgModule({
  providers: [
    AuthService,
    ExtensionMessageService,
    SettingsService,
    NetworksService,
    AccountService,
  ],
})
export class CoreModule { }
