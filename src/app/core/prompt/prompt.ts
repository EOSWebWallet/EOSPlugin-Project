import { NetworkError, ExtensionMessageType } from '../message/message.interface';
import { Browser } from '../browser/browser';
import { IPromptOptions } from './prompt.interface';

declare var browser: any;
declare var window: any;

export class Prompts {
  static PATH_PROMPT = '/index.html?prompt';

  private static openWindow = null;

  static async open(options: IPromptOptions): Promise<void> {
    if (Prompts.openWindow) {
      Prompts.openWindow.close();
      Prompts.openWindow = null;
    }

    const height = 650;
    const width = 400;
    const middleX = window.screen.availWidth / 2 - (width / 2);
    const middleY = window.screen.availHeight / 2 - (height / 2);

    const getPopup = async () => {
      try {
        const url = Browser.runtime.getURL('/index.html?prompt');
        return Browser.createWindow(url, width, height, options);
      } catch (e) {
        return null;
      }
    };

    this.openWindow = await getPopup();

    if (this.openWindow) {
      this.openWindow.onbeforeunload = () => {
        options.responder(NetworkError.promptClosedWithoutAction());

        // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
        // Must return undefined to bypass form protection
        this.openWindow = null;
        return undefined;
      };
    }
  }

  static async close(): Promise<void> {
    if (typeof browser !== 'undefined') {
      const { id } = await browser.windows.getCurrent();
      browser.windows.remove(id);
    } else {
      window.onbeforeunload = () => {};
      window.close();
    }
  }
}
