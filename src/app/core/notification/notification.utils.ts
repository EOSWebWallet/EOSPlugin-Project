import { NetworkError, ExtensionMessageType } from '../message/message.interface';
import { BrowserAPIUtils } from '../browser/browser.utils';
import { ExtensionMessageService } from '../message/message.service';
import { IPrompt } from './notification.interface';

declare var browser: any;
declare var window: any;

export class NotificationUrils {

  static openWindow = null;

  static async open(notification: IPrompt): Promise<void> {
    if (NotificationUrils.openWindow) {
      NotificationUrils.openWindow.close();
      NotificationUrils.openWindow = null;
    }

    const height = 600;
    const width = 700;
    const middleX = window.screen.availWidth / 2 - (width / 2);
    const middleY = window.screen.availHeight / 2 - (height / 2);

    const getPopup = async () => {
      try {
        const url = BrowserAPIUtils.runtime.getURL('/prompt.html');

        // Notifications get bound differently depending on browser
        // as Firefox does not support opening windows from background.
        if (typeof browser !== 'undefined') {
          const created = await BrowserAPIUtils.windows.create({
            url,
            height,
            width,
            type: 'popup'
          });

          window.notification = notification;
          return created;
        } else {
          const win = window.open(
            url,
            'EOSPluginPrompt',
            `width=${width},height=${height},resizable=0,top=${middleY},left=${middleX},titlebar=0`
          );
          win.data = notification;
          this.openWindow = win;
          return win;
        }
      } catch (e) {
        console.log('notification error', e);
        return null;
      }
    };

    await ExtensionMessageService.send({ type: ExtensionMessageType.SET_PROMPT, payload: JSON.stringify(notification) });

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
