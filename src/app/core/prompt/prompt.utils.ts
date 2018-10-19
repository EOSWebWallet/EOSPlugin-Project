import { NetworkError, ExtensionMessageType } from '../message/message.interface';
import { BrowserAPIUtils } from '../browser/browser.utils';
import { ExtensionMessageService } from '../message/message.service';
import { IPromptOptions } from './prompt.interface';

declare var browser: any;
declare var window: any;

export class PromptUtils {

  private static openWindow = null;

  static async open(options: IPromptOptions): Promise<void> {
    if (PromptUtils.openWindow) {
      PromptUtils.openWindow.close();
      PromptUtils.openWindow = null;
    }

    const height = 650;
    const width = 400;
    const middleX = window.screen.availWidth / 2 - (width / 2);
    const middleY = window.screen.availHeight / 2 - (height / 2);

    const getPopup = async () => {
      try {
        const url = BrowserAPIUtils.runtime.getURL('/index.html?prompt');
        this.openWindow = BrowserAPIUtils.openWindow(url, width, height, options);
      } catch (e) {
        console.log('prompt error', e);
        return null;
      }
    };

    const popup = await getPopup();

    // Handles the user closing the popup without taking any action
    popup.onbeforeunload = () => {
      options.responder(NetworkError.promptClosedWithoutAction());

      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
      // Must return undefined to bypass form protection
      this.openWindow = null;
      return undefined;
    };
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
