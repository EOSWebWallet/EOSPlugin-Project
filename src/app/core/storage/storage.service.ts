import { IPlugin } from '../plugin/plugin.interface';

import { BrowserAPIUtils } from '../browser/browser.utils';

import { PluginUtils } from '../plugin/plugin.utils';

export class StorageUtils {
  private static KEY_SALT = 'salt';

  static save(plugin: IPlugin): Promise<IPlugin> {
    return new Promise(resolve => {
      BrowserAPIUtils.storage.local.set({ plugin }, () => resolve(plugin));
    });
  }

  static get(): Promise<IPlugin> {
    return new Promise(resolve => {
      BrowserAPIUtils.storage.local.get('plugin', result => resolve(
        result.plugin
          ? PluginUtils.fromJson(result.plugin)
          : PluginUtils.createPlugin()
        ));
    });
  }

  static getSalt(): Promise<string> {
    return new Promise(resolve => {
      BrowserAPIUtils.storage.local.get('salt', possible => {
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
      BrowserAPIUtils.storage.local.set({ salt }, () => resolve(salt));
    });
  }
}
