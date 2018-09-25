import { LocalStream } from 'extension-streams/dist';

import { IExtensionMessage } from './message.interface';
import { BrowserAPIUtils } from '../browser/browser.utils';

export class ExtensionMessageService {

  static send(message: IExtensionMessage): Promise<any> {
    return BrowserAPIUtils.localStream.send(message);
  }
}
