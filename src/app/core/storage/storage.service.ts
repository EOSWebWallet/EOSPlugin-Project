import { IPlugin } from '../plugin/plugin.interface';

import { Browser } from '../browser/browser';

import { PluginUtils } from '../plugin/plugin.utils';

export class StorageUtils {
  private static KEY_SALT = 'salt';

  static save(plugin: IPlugin): Promise<IPlugin> {
    return new Promise(resolve => {
      Browser.storage.local.set({ plugin }, () => resolve(plugin));
    });
  }

  static get(): Promise<IPlugin> {
    return new Promise(resolve => {
      Browser.storage.local.get('plugin', result => resolve(
        result.plugin
          ? PluginUtils.fromJson(result.plugin)
          : PluginUtils.createPlugin()
        ));
    });
  }

  static getSalt(): Promise<string> {
    return new Promise(resolve => {
      Browser.storage.local.get('salt', possible => {
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
      Browser.storage.local.set({ salt }, () => resolve(salt));
    });
  }

  static setLang(lang: string): Promise<string> {
    return new Promise(resolve => {
      Browser.storage.local.set({ lang }, () => resolve(lang));
    });
  }

  static getLang(): Promise<string> {
    return new Promise(resolve => {
      Browser.storage.local.get('lang', possible => resolve(possible.lang));
    });
  }
}
