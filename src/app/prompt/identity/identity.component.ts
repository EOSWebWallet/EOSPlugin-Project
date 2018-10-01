import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';

import { IAccount, IAccountFields } from '../../core/account/account.interface';
import { INetworkAccount } from '../../core/network/network.interface';

import { PromptService } from '../prompt.service';
import { AccountService } from '../../core/account/account.service';

import { AccountUtils } from '../../core/account/account.utils';
import { NotificationUtils } from '../../core/notification/notification.utils';

@Component({
  selector: 'app-prompt-identity',
  templateUrl: './identity.component.html',
})
export class IdentityComponent implements OnInit {

  accounts: IAccount[];

  constructor(
    private accountService: AccountService,
    private promptService: PromptService,
  ) { }

  ngOnInit(): void {
    this.accountService.accounts$
      .pipe(
        map(accounts => accounts.filter(a => AccountUtils.hasRequirements(a, this.requirements))),
        first()
      )
      .subscribe(accounts => this.accounts = accounts);
  }

  get requirements(): IAccountFields {
    return this.promptService.prompt.requirements;
  }

  onAccountSelect(account: IAccount, networkAccount: INetworkAccount): void {
    this.promptService.prompt.responder(AccountUtils.createAccountIdentity(account, networkAccount));
    NotificationUtils.close();
  }
}
