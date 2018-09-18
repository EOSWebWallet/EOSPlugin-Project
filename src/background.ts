
import { LocalStream } from 'extension-streams/dist';

import { ExtensionMessageType, IExtensionMessage } from './app/core/message/message.interface';

import { IPlugin } from './app/core/plugin/plugin.interface';

import { PluginUtils } from './app/core/plugin/plugin.utils';
import { KeypairUtils } from './app/core/keypair/keypair.utils';
import { StorageUtils } from './app/core/storage/storage.service';
import { BrowserAPIUtils } from './app/core/browser/browser.utils';

export class Background {

  seed = '';

  constructor() {
    this.initExtensionMessaging();
  }

  initExtensionMessaging(): void {
    BrowserAPIUtils.localStream.watch((request, cb) => {
      this.dispenseMessage(cb, request);
    });
  }

  dispenseMessage(cb: Function, message: IExtensionMessage): void {
    switch (message.type) {
      case ExtensionMessageType.IS_AUTHORIZED: this.isAuthorized(cb); break;
      case ExtensionMessageType.SET_SEED: this.setSeed(message.payload, cb); break;
      case ExtensionMessageType.STORE_PLUGIN: this.srorePlugin(message.payload, cb); break;
      case ExtensionMessageType.LOAD_PLUGIN: this.load(cb); break;
    }
  }

  isAuthorized(cb: Function) {
    if (this.seed.length) {
      StorageUtils.get().then(pluginData => {
        try {
          const plugin = PluginUtils.decrypt(pluginData, this.seed);
          cb(!PluginUtils.isEncrypted(plugin));
        } catch (e) {
          this.seed = '';
          cb(false);
        }
      });
    } else {
      cb(false);
    }
  }

  setSeed(seed: string, cb: Function): void {
    this.seed = seed;
    cb(seed);
  }

  srorePlugin(pluginData: any, cb: Function): void {
    const plugin = PluginUtils.fromJson(pluginData);

    plugin.keychain.accounts = plugin.keychain.accounts.map(account => ({
      ...account,
      keypair: KeypairUtils.encrypt(account.keypair, this.seed)
    }));

    const encryptedPlugin = PluginUtils.encrypt(plugin, this.seed);

    StorageUtils.save(encryptedPlugin)
      .then(saved => cb(PluginUtils.decrypt(saved, this.seed)));
  }

  load(cb: Function): void {
    StorageUtils.get().then(pluginData => {
      cb(!this.seed.length
        ? pluginData
        : PluginUtils.decrypt(pluginData, this.seed)
      );
    });
  }
}

export const background = new Background();

