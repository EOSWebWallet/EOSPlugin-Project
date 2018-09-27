import { NetworkError, ExtensionMessageType } from '../message/message.interface';
import { BrowserAPIUtils } from '../browser/browser.utils';
import { ExtensionMessageService } from '../message/message.service';
import { IPrompt } from './notification.interface';

declare var browser: any;
declare var window: any;

export class NotificationUtils {

  static openWindow = null;

  static async open(notification: IPrompt): Promise<void> {
    if (NotificationUtils.openWindow) {
      NotificationUtils.openWindow.close();
      NotificationUtils.openWindow = null;
    }

    const height = 600;
    const width = 700;
    const middleX = window.screen.availWidth / 2 - (width / 2);
    const middleY = window.screen.availHeight / 2 - (height / 2);

    const getPopup = async () => {
      try {
        const url = BrowserAPIUtils.runtime.getURL('/prompt.html');
        this.openWindow = BrowserAPIUtils.openWindow(url, width, height, notification);
      } catch (e) {
        console.log('notification error', e);
        return null;
      }
    };

    const popup = await getPopup();

    // Handles the user closing the popup without taking any action
    popup.onbeforeunload = () => {
      notification.responder(NetworkError.promptClosedWithoutAction());

      // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
      // Must return undefined to bypass form protection
      this.openWindow = null;
      return undefined;
    };
  }

  static async close(): Promise<void> {
    if (typeof browser !== 'undefined') {
      const { id: windowId } = (await BrowserAPIUtils.windows.getCurrent());
      BrowserAPIUtils.windows.remove(windowId);
    } else {
      window.onbeforeunload = () => {};
      window.close();
    }
  }
}
