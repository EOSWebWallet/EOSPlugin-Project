import { EncryptedStream, LocalStream } from 'extension-streams/dist';
import { EncryptUtils } from './app/core/encrypt/encrypt.utils';
import { NetworkMessageType, NetworkError, ExtensionMessageType, INetworkMessage } from './app/core/message/message.interface';
import { ExtensionMessageService } from './app/core/message/message.service';
import { BrowserAPIUtils } from './app/core/browser/browser.utils';

class Content {

  static INJECTION_SCRIPT_FILENAME = 'inject.js';
  static STREAM_NAME = 'injected';
  static PLUGIN_NAME = 'eosPlugin';
  static PLUGIN_LOADED = 'eosPluginLoaded';

  private stream: EncryptedStream | any;
  private isReady = false;

  constructor() {
    this.setupEncryptedStream();
    this.injectInteractionScript();
  }

  setupEncryptedStream(): void {
    this.stream = new EncryptedStream(Content.PLUGIN_NAME, EncryptUtils.text(256));
    this.stream.listenWith(msg => this.contentListener(msg));

    this.stream.onSync(() => {
      this.stream.send({ type: NetworkMessageType.PUSH_PLUGIN }, Content.STREAM_NAME);
      this.isReady = true;
      document.dispatchEvent(new CustomEvent(Content.PLUGIN_LOADED));
    });
  }

  injectInteractionScript(): void {
    const script = document.createElement('script');
    script.src = BrowserAPIUtils.extension.getURL(Content.INJECTION_SCRIPT_FILENAME);
    (document.head || document.documentElement).appendChild(script);
    script.onload = () => script.remove();
  }

  contentListener(msg: INetworkMessage): void {
    if (!this.isReady || !msg) {
      return;
    }

    if (!this.stream.synced && (!msg.hasOwnProperty('type') || msg.type !== 'sync')) {
      this.stream.send({ type: NetworkMessageType.ERROR, payload: NetworkError.maliciousEvent() }, Content.STREAM_NAME);
      return;
    }

    msg.domain = BrowserAPIUtils.host;
    if (msg.hasOwnProperty('payload')) {
      msg.payload.domain = BrowserAPIUtils.host;
    }

    switch (msg.type) {
      case 'sync': this.sync(msg); break;
      case NetworkMessageType.GET_IDENTITY: this.getIdentity(msg); break;
      case NetworkMessageType.REQUEST_SIGNATURE: this.requestSignature(msg); break;
      default: this.stream.send({ type: NetworkMessageType.ERROR, payload: NetworkError.maliciousEvent() }, Content.STREAM_NAME);
    }
  }

  respond(message: INetworkMessage, payload: any): void {
    if (!this.isReady) {
      return;
    }

    this.stream.send({
      type: !payload || payload.hasOwnProperty('isError')
        ? NetworkMessageType.ERROR
        : message.type,
      payload: message.payload
    }, Content.STREAM_NAME);
  }

  sync(message: any): void {
    this.stream.key = message.handshake.length ? message.handshake : null;
    this.stream.send({ type: 'sync' }, Content.STREAM_NAME);
    this.stream.synced = true;
  }

  getIdentity(message: INetworkMessage): void {
    if (!this.isReady) {
      return;
    }

    ExtensionMessageService.send({ type: ExtensionMessageType.GET_IDENTITY, payload: message.payload })
      .then(res => this.respond(message, res));
  }

  requestSignature(message: INetworkMessage): void {
    if (!this.isReady) {
      return;
    }

    ExtensionMessageService.send({ type: ExtensionMessageType.REQUEST_SIGNATURE, payload: message.payload })
      .then(res => this.respond(message, res));
  }
}

export const content = new Content();
