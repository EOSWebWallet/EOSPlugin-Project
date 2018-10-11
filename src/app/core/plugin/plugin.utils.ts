import AES from 'aes-oop';

import { IPlugin } from './plugin.interface';

import { KeychainUtils } from '../keychain/keychain.utils';
import { SettingsUtils } from '../settings/settings.utils';

export class PluginUtils {
  static PLUGIN_STORE = 'PLUGIN_STORE';
  static PLUGIN_LOAD = 'PLUGIN_LOAD';
  static PLUGIN_LOAD_SUCCESS = 'PLUGIN_LOAD_SUCCESS';
  static PLUGIN_IMPORT = 'PLUGIN_IMPORT';
  static PLUGIN_DESTROY = 'PLUGIN_DESTROY';

  static fromJson(json: any): IPlugin {
    return {
      hasEncryptionKey: json.hasEncryptionKey,
      keychain: typeof json.keychain === 'string'
        ? json.keychain
        : KeychainUtils.fromJson(json.keychain),
      settings: json.settings
        ? SettingsUtils.fromJson(json.settings)
        : null
    };
  }

  static isEncrypted(plugin: IPlugin): boolean {
    return typeof plugin.keychain !== 'object';
  }

  static decrypt(pluginData: any, seed: string): IPlugin {
    return {
      ...pluginData,
      keychain: PluginUtils.isEncrypted(pluginData)
        ? KeychainUtils.fromJson(AES.decrypt(pluginData.keychain, seed))
        : pluginData.keychain
    };
  }

  static encrypt(plugin: IPlugin, seed: string): any {
    return {
      ...plugin,
      keychain: PluginUtils.isEncrypted(plugin)
        ? plugin.keychain
        : AES.encrypt(plugin.keychain, seed)
    };
  }

  static createPlugin(hasEncryptionKey?: boolean): IPlugin {
    return {
      hasEncryptionKey,
      keychain: {
        accounts: [],
        permissions: []
      },
      settings: {
        networks: []
      },
    };
  }

  static createBlob(data: any): Blob {
    return new Blob([ JSON.stringify(data) ], { type: 'text/json' });
  }

  static createPluginData(pluginText: string): any {
    return JSON.parse(pluginText);
  }
}
