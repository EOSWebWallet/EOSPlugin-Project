import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { SettingsService } from './settings/settings.service';
import { NetworksService } from './network/networks.service';
import { AccountService } from './account/account.service';
import { PluginService } from './plugin/plugin.service';
import { EOSService } from './eos/eos.service';
import { UIService } from './ui/ui.service';

@NgModule({
  providers: [
    AuthService,
    SettingsService,
    NetworksService,
    AccountService,
    PluginService,
    EOSService,
    UIService,
  ],
})
export class CoreModule { }
