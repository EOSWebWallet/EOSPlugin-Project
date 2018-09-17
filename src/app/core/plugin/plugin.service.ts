import AES from 'aes-oop';

import { IPlugin } from './plugin.interface';

import { KeychainService } from '../keychain/keychain.service';
import { SettingsService } from '../settings/settings.service';

export class PluginService {
  static PLUGIN_STORE = 'PLUGIN_STORE';
  static PLUGIN_STORE_SUCCESS = 'PLUGIN_STORE_SUCCESS';
  static PLUGIN_LOAD = 'PLUGIN_LOAD';
  static PLUGIN_LOAD_SUCCESS = 'PLUGIN_LOAD_SUCCESS';

  static fromJson(json: any): IPlugin {
    return {
      hasEncryptionKey: json.hasEncryptionKey,
      keychain: typeof json.keychain === 'string'
        ? json.keychain
        : KeychainService.fromJson(json.keychain),
      settings: json.settings
        ? SettingsService.fromJson(json.settings)
        : null
    };
  }

  static isEncrypted(plugin: IPlugin): boolean {
    return typeof plugin.keychain !== 'object';
  }

  static decrypt(pluginData: any, seed: string): IPlugin {
    return {
      ...pluginData,
      keychain: PluginService.isEncrypted(pluginData)
        ? KeychainService.fromJson(AES.decrypt(pluginData.keychain, seed))
        : pluginData.keychain
    };
  }

  static encrypt(plugin: IPlugin, seed: string): any {
    return {
      ...plugin,
      keychain: PluginService.isEncrypted(plugin)
        ? plugin.keychain
        : AES.encrypt(plugin.keychain, seed)
    };
  }

  static createPlugin(hasEncryptionKey?: boolean): IPlugin {
    return {
      hasEncryptionKey,
      keychain: {
        keypairs: []
      },
      settings: {
        networks: []
      }
    };
  }
}
