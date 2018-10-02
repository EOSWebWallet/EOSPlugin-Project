
import { LocalStream } from 'extension-streams/dist';

import { ExtensionMessageType, IExtensionMessage, NetworkError } from './app/core/message/message.interface';

import { IPlugin } from './app/core/plugin/plugin.interface';

import { PluginUtils } from './app/core/plugin/plugin.utils';
import { KeypairUtils } from './app/core/keypair/keypair.utils';
import { StorageUtils } from './app/core/storage/storage.service';
import { BrowserAPIUtils } from './app/core/browser/browser.utils';
import { AccountUtils } from './app/core/account/account.utils';
import { SignatureService } from './app/core/signature/signature.service';
import { INetwork } from './app/core/network/network.interface';

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
      case ExtensionMessageType.DESTROY_PLUGIN: this.destroy(cb); break;
      case ExtensionMessageType.GET_IDENTITY: this.getIdentity(message.payload, cb); break;
      case ExtensionMessageType.REQUEST_SIGNATURE: this.requestSignature(message.payload, cb); break;
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

  destroy(cb: Function): void {
    this.seed = '';
    BrowserAPIUtils.storage.local.clear();
    cb(true);
  }

  getIdentity(requestData: any, cb: Function): void {
    this.load(plugin => {
      const accounts = AccountUtils.filterAccountsByNetwork(plugin.keychain.accounts, requestData.network);
      AccountUtils.getIdentity(accounts, identity => {
        if (!identity) {
          cb(NetworkError.signatureError('identity_rejected', 'User rejected the provision of an Identity'));
          return false;
        }
        cb(identity);
      });
    });
  }

  requestSignature(payload: any, cb: Function): void {
    this.load(plugin => {
      const account = AccountUtils.getAccount(payload.identity, plugin.keychain.accounts);
      const keypair = KeypairUtils.decrypt(account.keypair, this.seed);
      SignatureService.requestSignature(plugin, payload.identity, payload, keypair.privateKey, cb);
    });
  }
}

export const background = new Background();

