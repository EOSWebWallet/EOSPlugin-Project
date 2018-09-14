
import { LocalStream } from 'extension-streams/dist';

import { ExtensionMessageType, IExtensionMessage } from './app/core/message/message.interface';

import { IPlugin } from './app/core/plugin/plugin.interface';

import { PluginService } from './app/core/plugin/plugin.service';
import { KeypairService } from './app/core/keypair/keypair.service';
import { StorageService } from './app/core/storage/storage.service';

export class Background {

  seed: string;

  constructor() {
    this.initExtensionMessaging();
  }

  initExtensionMessaging(): void {
    LocalStream.watch((request, cb) => {
      this.dispenseMessage(cb, request);
    });
  }

  dispenseMessage(cb: Function, message: IExtensionMessage): void {
    switch (message.type) {
      case ExtensionMessageType.SET_SEED: this.setSeed(message.payload, cb); break;
      case ExtensionMessageType.STORE_PLUGIN: this.srorePlugin(message.payload, cb); break;
    }
  }

  setSeed(seed: string, cb: Function): void {
    this.seed = seed;
  }

  srorePlugin(pluginData: any, cb: Function): void {
    const plugin = PluginService.fromJson(pluginData);

    plugin.keychain.keypairs = plugin.keychain.keypairs.map(keypair => KeypairService.encrypt(keypair, this.seed));

    const encryptedPlugin = PluginService.encrypt(plugin, this.seed);

    StorageService.save(encryptedPlugin)
      .then(saved => cb(PluginService.decrypt(saved, this.seed)));
  }
}

const background = new Background();

