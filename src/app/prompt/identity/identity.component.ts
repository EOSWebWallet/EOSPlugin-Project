import { Component } from '@angular/core';

import { IAccount, IAccountIdentity } from '../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../core/network/network.interface';

import { PromptService } from '../prompt.service';

import { AccountUtils } from '../../core/account/account.utils';
import { PromptUtils } from '../../core/prompt/prompt.utils';
import { IIdentityPromtOptions } from '../../core/prompt/prompt.interface';

@Component({
  selector: 'app-prompt-identity',
  templateUrl: './identity.component.html',
  styleUrls: [ './identity.component.scss' ]
})
export class IdentityComponent {

  identity: IAccountIdentity;

  constructor(
    private promptService: PromptService,
  ) { }

  get accounts(): IAccount[] {
    return (<IIdentityPromtOptions> this.promptService.prompt).accounts;
  }

  get network(): INetwork {
    return this.accounts[0].network;
  }

  isSelected(networkAccount: INetworkAccount): boolean {
    return this.identity
      && !!this.identity.accounts
        .find(ia => ia.name === networkAccount.name && ia.authority === networkAccount.authority);
  }

  onSelect(account: IAccount, networkAccount: INetworkAccount): void {
    this.identity = AccountUtils.createAccountIdentity(account, networkAccount);
  }

  onDeny(): void {
    this.promptService.prompt.responder(null);
    PromptUtils.close();
  }

  onAccept(): void {
    this.promptService.prompt.responder(this.identity);
    PromptUtils.close();
  }
}
