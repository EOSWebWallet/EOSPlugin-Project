import { NgModule } from '@angular/core';

import { AuthService } from './auth/auth.service';
import { BrowserAPIService } from './browser/browser.service';
import { EncryptService } from './encrypt/encrypt.service';
import { StorageService } from './storage/storage.service';
import { PluginService } from './plugin/plugin.service';

@NgModule({
  providers: [
    AuthService,
    BrowserAPIService,
    EncryptService,
    StorageService,
    PluginService
  ],
})
export class CoreModule { }
