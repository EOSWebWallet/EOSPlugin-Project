
import { LocalStream } from 'extension-streams/dist';

import { ExtensionMessageType, IExtensionMessage } from './app/core/message/message.interface';

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
    }
  }

  setSeed(seed: string, cb: Function): void {
    this.seed = seed;
  }
}

const background = new Background();

