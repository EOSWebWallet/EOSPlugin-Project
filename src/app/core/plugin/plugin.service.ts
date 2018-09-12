import { Injectable } from '@angular/core';

import { IEncryptedPassword } from '../auth/auth.interface';
import { IPluginInstance } from './plugin.interface';

@Injectable()
export class PluginService {

  private plugin: IPluginInstance;

  createInstance(password: IEncryptedPassword): void {
    this.plugin = {};
  }

}
