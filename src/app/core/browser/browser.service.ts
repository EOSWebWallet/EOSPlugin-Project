import { LocalStream } from 'extension-streams/dist';
import { Subject } from 'rxjs/internal/Subject';

import { IBrowserAPI } from './browser.interface';

declare var chrome: any;
declare var browser: any;

const BrowserAPI: IBrowserAPI = chrome || browser;

// if (!BrowserAPI.storage) {
//   BrowserAPI.storage = {
//     local: {
//       set: (value, cb) => Object.keys(value).map(key => {
//         localStorage.setItem(key, JSON.stringify(value[key]));
//         cb();
//       }),
//       get: (key, cb) => cb({ [key]: JSON.parse(localStorage.getItem(key)) })
//     }
//   };
// }

export class BrowserAPIService {

  private static _localStream: any;

  private static isAPIAvailable(): boolean {
    return !!BrowserAPI.storage;
  }

  static get storage(): any {
    return BrowserAPI.storage || {
      local: {
        set: (value, cb) => Object.keys(value).map(key => {
          localStorage.setItem(key, JSON.stringify(value[key]));
          cb();
        }),
        get: (key, cb) => cb({ [key]: JSON.parse(localStorage.getItem(key)) })
      }
    };
  }

  static get localStream(): any {
    if (!BrowserAPIService._localStream) {
      BrowserAPIService._localStream = BrowserAPIService.createLocalStream();
    }
    return BrowserAPIService._localStream;
  }

  private static createLocalStream(): any {
    if (BrowserAPIService.isAPIAvailable()) {
      return LocalStream;
    } else {
      const subject = new Subject<any>();
      return {
        send: message => new Promise(resolve => {
          subject.next({ message, cb: result => resolve(result) });
        }),
        watch: handler => subject.subscribe(({ message, cb }) => handler(message, cb))
      };
    }
  }
}
