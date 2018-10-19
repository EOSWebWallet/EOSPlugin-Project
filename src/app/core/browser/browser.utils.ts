import { LocalStream } from 'extension-streams/dist';
import { Subject } from 'rxjs/internal/Subject';

import { IBrowserAPI } from './browser.interface';

declare var chrome: any;
declare var browser: any;

export class BrowserAPIUtils {

  private static _localStream: any;

  private static isAPIAvailable(): boolean {
    return !!BrowserAPIUtils.browserAPI.storage;
  }

  private static get browserAPI(): IBrowserAPI {
    return chrome || browser;
  }

  static get storage(): any {
    return /*BrowserAPI.storage ||*/ {
      local: {
        set: (value, cb) => Object.keys(value).map(key => {
          localStorage.setItem(key, JSON.stringify(value[key]));
          cb();
        }),
        get: (key, cb) => cb({ [key]: JSON.parse(localStorage.getItem(key)) }),
        clear: () => localStorage.clear()
      }
    };
  }

  static get localStream(): any {
    if (!BrowserAPIUtils._localStream) {
      BrowserAPIUtils._localStream = BrowserAPIUtils.createLocalStream();
    }
    return BrowserAPIUtils._localStream;
  }

  static get extension(): any {
    return BrowserAPIUtils.browserAPI.extension;
  }

  static get windows(): any {
    return BrowserAPIUtils.browserAPI.windows;
  }

  static get runtime(): any {
    return this.isAPIAvailable()
      ? BrowserAPIUtils.browserAPI.runtime
      : {
        getURL: () => 'http://localhost:4200/prompt'
      };
  }

  static get host() {
    const host = location.hostname;
    return host.indexOf('www.') === 0
      ? host.replace('www.', '')
      : host;
  }

  static openWindow(url: string, width: number, height: number, data: any): any {
    // Notifications get bound differently depending on browser
    // as Firefox does not support opening windows from background.
    if (typeof browser !== 'undefined') {
      BrowserAPIUtils.windows.create({
        url,
        height,
        width,
        type: 'popup'
      });
      (window as any).notification = data;
    } else {
      const middleX = window.screen.availWidth / 2 - (width / 2);
      const middleY = window.screen.availHeight / 2 - (height / 2);
      const win = window.open(
        url,
        'EOSPluginPrompt',
        `width=${width},height=${height},resizable=0,top=${middleY},left=${middleX},titlebar=0`
      );
      (win as any).windowData = data;
      return win;
    }
  }

  static getWindowData(): any {
    return (window as any).windowData || BrowserAPIUtils.extension.getBackgroundPage().notification;
  }

  private static createLocalStream(): any {
    if (BrowserAPIUtils.isAPIAvailable()) {
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
