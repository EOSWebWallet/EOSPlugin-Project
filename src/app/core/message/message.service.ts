import { Injectable } from '@angular/core';
import { LocalStream } from 'extension-streams/dist';
import { Observable } from 'rxjs/internal/Observable';
import { from } from 'rxjs/internal/observable/from';

import { IExtensionMessage } from './message.interface';
import { BrowserAPIUtils } from '../browser/browser.utils';

@Injectable()
export class ExtensionMessageService {

  send(message: IExtensionMessage): Observable<any> {
    return from(BrowserAPIUtils.localStream.send(message));
  }
}
