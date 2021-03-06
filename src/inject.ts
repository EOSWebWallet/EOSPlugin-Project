import { EncryptedStream } from 'extension-streams';
import { NetworkMessageType } from './app/core/message/message.interface';
import { Encryption } from './app/core/encryption/encryption';
import { EOSPlugin } from './plugin';

declare var window: any;

export class Inject {
  static STREAM_NAME = 'eosPluginInjected';
  static PLUGIN_NAME = 'eosPlugin';

  constructor() {
    const stream = new EncryptedStream(Inject.STREAM_NAME, Encryption.text(64));

    stream.listenWith(msg => {
      if (msg && msg.hasOwnProperty('type') && msg.type === NetworkMessageType.PUSH_PLUGIN) {
        window.eosPlugin = new EOSPlugin(stream);
      }
    });

    stream.sync(Inject.PLUGIN_NAME, stream.key);
  }
}

export const inject = new Inject();
