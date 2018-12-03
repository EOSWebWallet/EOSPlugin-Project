
import AES from 'aes-oop';
import { LocalStream } from 'extension-streams/dist';

import { ExtensionMessageType, IExtensionMessage, NetworkError } from './app/core/message/message.interface';

import { IPlugin } from './app/core/plugin/plugin.interface';
import { IKeypair } from './app/core/keypair/keypair.interface';
import { IAccountIdentity } from './app/core/account/account.interface';
import { INetwork } from './app/core/network/network.interface';

import { Plugins } from './app/core/plugin/plugin';
import { Keypairs } from './app/core/keypair/keypair';
import { PluginStorage } from './app/core/storage/storage';
import { Browser } from './app/core/browser/browser';
import { Accounts } from './app/core/account/account';
import { EOS } from './app/core/eos/eos';
import { Encryption } from './app/core/encryption/encryption';

export class Background {

  seed = '';

  constructor() {
    this.initExtensionMessaging();
  }

  initExtensionMessaging(): void {
    Browser.stream.watch((request, cb) => {
      this.dispenseMessage(cb, request);
    });
  }

  dispenseMessage(cb: Function, message: IExtensionMessage): void {
    switch (message.type) {
      case ExtensionMessageType.IS_AUTHORIZED: this.isAuthorized(cb); break;
      case ExtensionMessageType.SET_SEED: this.setSeed(message.payload, cb); break;
      case ExtensionMessageType.CHANGE_SEED: this.changeSeed(message.payload, cb); break;
      case ExtensionMessageType.STORE_PLUGIN: this.srorePlugin(message.payload, cb); break;
      case ExtensionMessageType.LOAD_PLUGIN: this.load(cb); break;
      case ExtensionMessageType.DESTROY_PLUGIN: this.destroy(cb); break;
      case ExtensionMessageType.EXPORT_PLUGIN: this.export(message.payload, cb); break;
      case ExtensionMessageType.IMPORT_PLUGIN: this.import(message.payload, cb); break;
      case ExtensionMessageType.GET_IDENTITY: this.getIdentity(message.payload, cb); break;
      case ExtensionMessageType.REQUEST_SIGNATURE: this.requestSignature(message.payload, cb); break;
      case ExtensionMessageType.SIGNUP: this.signup(JSON.parse(message.payload), cb); break;
    }
  }

  isAuthorized(cb: Function) {
    if (this.seed.length) {
      PluginStorage.get().then(pluginData => {
        try {
          const plugin = Plugins.decrypt(pluginData, this.seed);
          cb(!Plugins.isEncrypted(plugin));
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
    const plugin = Plugins.fromJson(pluginData);

    plugin.keychain.accounts = plugin.keychain.accounts.map(account => ({
      ...account,
      keypair: Keypairs.encrypt(account.keypair, this.seed)
    }));

    const encryptedPlugin = Plugins.encrypt(plugin, this.seed);

    PluginStorage.save(encryptedPlugin)
      .then(saved => cb(Plugins.decrypt(saved, this.seed)));
  }

  load(cb: Function): void {
    PluginStorage.get().then(pluginData => {
      cb(!this.seed.length
        ? pluginData
        : Plugins.decrypt(pluginData, this.seed)
      );
    });
  }

  destroy(cb: Function): void {
    this.seed = '';
    Browser.storage.local.clear();
    cb(true);
  }

  export(payload: any, cb: Function): void {
    if (this.seed === payload.seed) {
      this.load(plugin => {
        plugin.keychain.accounts = plugin.keychain.accounts.map(account => {
          const decrypted = Keypairs.decrypt(account.keypair, payload.seed);
          return ({
            ...account,
            keypair: Keypairs.encrypt(decrypted, payload.seed)
          });
        });
        const pluginData = Plugins.encrypt(plugin, payload.seed);
        PluginStorage.getSalt().then(salt => cb({ pluginData, salt }));
      });
    } else {
      cb(null);
    }
  }

  async import(payload: any, cb: Function) {
    const { pluginData, salt } = Plugins.createPluginData(<string> payload.file.value);
    const oldSalt = await PluginStorage.getSalt();
    await PluginStorage.setSalt(salt);
    const [m, s] = await Encryption.generateMnemonic(payload.password);
    try {
      const decryptedPlugin = Plugins.decrypt(pluginData, s);
      if (!Plugins.isEncrypted(decryptedPlugin)) {
        this.seed = s;
        PluginStorage.save(pluginData).then(saved => cb(Plugins.decrypt(saved, this.seed)));
      } else {
        cb(false);
      }
    } catch (e) {
      await PluginStorage.setSalt(oldSalt);
      cb(false);
    }
  }

  changeSeed(payload: any, cb: Function): void {
    const { seed, newSeed } = payload;
    if (seed === this.seed) {
      this.seed = newSeed;
      cb(this.seed);
    } else {
      cb(false);
    }
  }

  getIdentity(requestData: any, cb: Function): void {
    this.load(plugin => {
      Accounts.requestIdentity(requestData.network, identity => {
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
      EOS.requestSignature({
        plugin,
        payload,
      }).then(result => cb(result));
    });
  }

  signup({ signargs, keypair }, cb: Function): void {
    const privateKey = AES.decrypt(keypair.privateKey, this.seed);
    EOS.signer(privateKey, signargs, signature => {
      cb(signature ? {
        signatures: [ signature ]
      } : null);
    });
  }
}

export const background = new Background();

