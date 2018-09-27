import { Injectable } from '@angular/core';

import { IPrompt } from '../core/notification/notification.interface';

import { BrowserAPIUtils } from '../core/browser/browser.utils';

declare var window: any;

@Injectable()
export class PromptService {

  get prompt(): IPrompt {
    return BrowserAPIUtils.getWindowData();
  }
}
