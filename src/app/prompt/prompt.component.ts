import { Component } from '@angular/core';

import { IPromptOptions } from '../core/prompt/prompt.interface';

import { PromptService } from './prompt.service';

import { BrowserAPIUtils } from '../core/browser/browser.utils';

declare var window: any;

@Component({
  selector: 'app-prompt',
  templateUrl: './prompt.component.html',
})
export class PromptComponent {
  title = 'prompt';

  constructor(private promptService: PromptService) {
  }

  get prompt(): IPromptOptions {
    return this.promptService.prompt;
  }
}
