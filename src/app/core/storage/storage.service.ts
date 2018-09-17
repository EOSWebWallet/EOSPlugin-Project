import { IPlugin } from '../plugin/plugin.interface';

import { BrowserAPIService } from '../browser/browser.service';

import { PluginService } from '../plugin/plugin.service';

export class StorageService {
  private static KEY_SALT = 'salt';

  static save(plugin: IPlugin): Promise<IPlugin> {
    return new Promise(resolve => {
      BrowserAPIService.storage.local.set({ plugin }, () => resolve(plugin));
    });
  }

  static get(): Promise<IPlugin> {
    return new Promise(resolve => {
      BrowserAPIService.storage.local.get('plugin', result => resolve(
        result.plugin
          ? PluginService.fromJson(result.plugin)
          : PluginService.createPlugin()
        ));
    });
  }

  static getSalt(): Promise<string> {
    return new Promise(resolve => {
      BrowserAPIService.storage.local.get('salt', possible => {
        if (JSON.stringify(possible) !== '{}') {
          resolve(possible.salt);
        } else {
          resolve('SALT_ME');
        }
      });
    });
  }

  static setSalt(salt: string): Promise<string> {
    return new Promise(resolve => {
      BrowserAPIService.storage.local.set({ salt }, () => resolve(salt));
    });
  }
}
