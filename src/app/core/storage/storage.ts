import { EOSPlugin } from '../plugin/plugin';

import { BrowserAPI } from '../browser/browser';

export class AppStorage {
  private static KEY_SALT = 'salt';

  static save(plugin: EOSPlugin): Promise<EOSPlugin> {
    return new Promise(resolve => {
      BrowserAPI.storage.local.set({ plugin }, () => resolve(plugin));
    });
  }

  static get(): Promise<EOSPlugin> {
    return new Promise(resolve => {
      BrowserAPI.storage.local.get('plugin', result => EOSPlugin.fromJson(result.plugin));
    });
  }

  static getSalt(): Promise<string> {
    return new Promise(resolve => {
      BrowserAPI.storage.local.get('salt', possible => {
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
      BrowserAPI.storage.local.set({ salt }, () => resolve(salt));
    });
  }
}
