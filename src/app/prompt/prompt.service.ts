import { Injectable } from '@angular/core';

import { IPromptOptions } from '../core/prompt/prompt.interface';

import { Browser } from '../core/browser/browser';

declare var window: any;

@Injectable()
export class PromptService {

  get prompt(): IPromptOptions {
    return Browser.getWindowData();
  }
}
