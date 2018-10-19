import { LocalStream } from 'extension-streams/dist';
import { Subject } from 'rxjs/internal/Subject';

import { IBrowserAPI, BrowserType, IBrowserStorage, BrowserStream } from './browser.interface';

declare var window: any;
declare var chrome: any;
declare var browser: any;

export class Browser {

  private static browserStream: BrowserStream;
  private static browserStorage: IBrowserStorage;

  static get storage(): any {
    if (!Browser.browserStorage) {
      Browser.browserStorage = Browser.createStorage();
    }
    return Browser.browserStorage;
  }

  static get stream(): BrowserStream {
    if (!Browser.browserStream) {
      Browser.browserStream = Browser.createLocalStream();
    }
    return Browser.browserStream;
  }

  static get extension(): any {
    return Browser.api.extension;
  }

  static get windows(): any {
    return Browser.api.windows;
  }

  static get runtime(): any {
    return Browser.api.runtime;
  }

  static get host() {
    const host = location.hostname;
    return host.indexOf('www.') === 0
      ? host.replace('www.', '')
      : host;
  }

  static createWindow(url: string, width: number, height: number, data: any): void {
    if (Browser.type === BrowserType.FIREFOX) {
      Browser.createFirefoxWindow(url, width, height, data);
    } else {
      Browser.createChromeWindow(url, width, height, data);
    }
  }

  static getWindowData(): any {
    return window.windowData || Browser.extension.getBackgroundPage().notification;
  }

  private static get apiAvailable(): boolean {
    return !!Browser.api.storage;
  }

  private static get api(): IBrowserAPI {
    return Browser.type === BrowserType.FIREFOX ? browser : chrome;
  }

  private static get type(): BrowserType {
    return window.browser ? BrowserType.FIREFOX : BrowserType.CHROME;
  }

  private static createLocalStream(): any {
    return Browser.apiAvailable ? LocalStream : this.createProxyStream();
  }

  private static createChromeWindow(url: string, width: number, height: number, data: any): void {
    const middleX = window.screen.availWidth / 2 - (width / 2);
    const middleY = window.screen.availHeight / 2 - (height / 2);
    const win = window.open(
      url,
      'EOSPluginPrompt',
      `width=${width},height=${height},resizable=0,top=${middleY},left=${middleX},titlebar=0`
    );
    win.windowData = data;
  }

  private static createFirefoxWindow(url: string, width: number, height: number, data: any): void {
    Browser.windows.create({ url, height, width, type: 'popup' });
    window.notification = data;
  }

  private static createProxyStream(): BrowserStream {
    const subject = new Subject<any>();
    return {
      send: message => new Promise(resolve => {
        subject.next({ message, cb: result => resolve(result) });
      }),
      watch: handler => subject.subscribe(({ message, cb }) => handler(message, cb))
    };
  }

  private static createStorage(): IBrowserStorage {
    return {
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
}
