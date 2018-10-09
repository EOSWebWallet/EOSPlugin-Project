import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAccount } from '../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../core/network/network.interface';

import { PromptService } from '../prompt.service';
import { AccountService } from '../../core/account/account.service';

import { AccountUtils } from '../../core/account/account.utils';
import { PromptUtils } from '../../core/prompt/prompt.utils';

@Component({
  selector: 'app-prompt-signature',
  templateUrl: './signature.component.html',
})
export class SignatureComponent {

  constructor(
    private accountService: AccountService,
    private promptService: PromptService,
  ) { }

  onAccept(): void {
    this.promptService.prompt.responder(true);
    PromptUtils.close();
  }
}
