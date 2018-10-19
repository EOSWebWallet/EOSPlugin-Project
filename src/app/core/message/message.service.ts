import { LocalStream } from 'extension-streams/dist';

import { IExtensionMessage } from './message.interface';
import { Browser } from '../browser/browser';

export class ExtensionMessageService {

  static send(message: IExtensionMessage): Promise<any> {
    return Browser.stream.send(message);
  }
}
