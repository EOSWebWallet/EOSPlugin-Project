import AES from 'aes-oop';

import { IPlugin } from './plugin.interface';

import { Keychains } from '../keychain/keychain';
import { Settings } from '../settings/settings';

export class Plugins {
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
        : Keychains.fromJson(json.keychain),
      settings: json.settings
        ? Settings.fromJson(json.settings)
        : null
    };
  }

  static isEncrypted(plugin: IPlugin): boolean {
    return typeof plugin.keychain !== 'object';
  }

  static decrypt(pluginData: any, seed: string): IPlugin {
    return {
      ...pluginData,
      keychain: Plugins.isEncrypted(pluginData)
        ? Keychains.fromJson(AES.decrypt(pluginData.keychain, seed))
        : pluginData.keychain
    };
  }

  static encrypt(plugin: IPlugin, seed: string): any {
    return {
      ...plugin,
      keychain: Plugins.isEncrypted(plugin)
        ? plugin.keychain
        : AES.encrypt(plugin.keychain, seed)
    };
  }

  static createPlugin(hasEncryptionKey?: boolean): IPlugin {
    return {
      hasEncryptionKey,
      keychain: {
        accounts: [],
      },
      settings: {
        networks: [
          {
            id: 'id1',
            protocol: 'https',
            name: 'Mainnet (BlockMatrix)',
            host: 'eosapi.blockmatrix.network',
            port: 443
          },
          {
            id: 'id2',
            protocol: 'https',
            name: 'Mainnet (Greymass)',
            host: 'eos.greymass.com',
            port: 443
          },
          {
            id: 'id3',
            protocol: 'https',
            name: 'Jungle (Eosmetal)',
            host: 'junglenodes.eosmetal.io',
            port: 443
          },
          {
            id: 'id4',
            protocol: 'https',
            name: 'Jungle (Smartz)',
            host: 'jungle.eos.smartz.io',
            port: 443
          }
        ]
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
