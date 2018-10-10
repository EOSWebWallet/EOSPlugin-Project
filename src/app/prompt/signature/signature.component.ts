import { Component } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAccount } from '../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../core/network/network.interface';

import { ISignaturePromtOptions } from '../../core/prompt/prompt.interface';

import { PromptService } from '../prompt.service';
import { AccountService } from '../../core/account/account.service';

import { AccountUtils } from '../../core/account/account.utils';
import { PromptUtils } from '../../core/prompt/prompt.utils';

@Component({
  selector: 'app-prompt-signature',
  templateUrl: './signature.component.html',
  styleUrls: [ './signature.component.scss' ]
})
export class SignatureComponent {

  constructor(
    private accountService: AccountService,
    private promptService: PromptService,
  ) { }

  readonly selectedNetworkAccountName$ = this.accountService.selectedAccount$
    .pipe(
      map(a => a.accounts.find(na => na.selected)),
      map(na => na && `${na.name}@${na.authority}`)
    );

  get signargs(): any {
    return (<ISignaturePromtOptions> this.promptService.prompt).signargs;
  }

  get account(): IAccount {
    return (<ISignaturePromtOptions> this.promptService.prompt).account;
  }

  get network(): INetwork {
    return this.account.network;
  }

  onAccept(): void {
    this.promptService.prompt.responder(true);
    PromptUtils.close();
  }

  onDeny(): void {
    this.promptService.prompt.responder(null);
    PromptUtils.close();
  }
}
