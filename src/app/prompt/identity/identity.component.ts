import { Component, OnInit } from '@angular/core';
import { first, filter } from 'rxjs/internal/operators';

import { IAccount, IAccountIdentity } from '../../core/account/account.interface';
import { INetworkAccount, INetwork } from '../../core/network/network.interface';

import { AccountService } from '../../core/account/account.service';
import { PromptService } from '../prompt.service';

import { AccountUtils } from '../../core/account/account.utils';
import { PromptUtils } from '../../core/prompt/prompt.utils';
import { IIdentityPromtOptions } from '../../core/prompt/prompt.interface';

@Component({
  selector: 'app-prompt-identity',
  templateUrl: './identity.component.html',
  styleUrls: [ './identity.component.scss' ]
})
export class IdentityComponent implements OnInit {

  identity: IAccountIdentity;

  accounts: IAccount[] = [];

  constructor(
    private promptService: PromptService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.accounts$
      .pipe(
        filter(Boolean),
        first()
      )
      .subscribe(accounts =>
        this.accounts = AccountUtils.filterAccountsByNetwork(accounts, this.network)
      );
  }

  get network(): INetwork {
    return (<IIdentityPromtOptions> this.promptService.prompt).network;
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
