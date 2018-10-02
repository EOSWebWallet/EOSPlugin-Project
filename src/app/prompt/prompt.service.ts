import { Injectable } from '@angular/core';

import { IPromptOptions } from '../core/prompt/prompt.interface';

import { BrowserAPIUtils } from '../core/browser/browser.utils';

declare var window: any;

@Injectable()
export class PromptService {

  get prompt(): IPromptOptions {
    return BrowserAPIUtils.getWindowData();
  }
}
