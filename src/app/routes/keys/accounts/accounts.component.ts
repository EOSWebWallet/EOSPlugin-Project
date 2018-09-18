import { Component, ViewChildren, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Subscribable, Subscription } from 'rxjs';

import { IAccount } from '../../../core/account/account.interface';
import { INetworkAccount } from '../../../core/network/network.interface';

import { AccountService } from '../../../core/account/account.service';

import { NetworkUtils } from '../../../core/network/network.utils';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
})
export class AccountsComponent implements OnInit, OnDestroy {
  static PATH_ACCOUNT = '/app/keys/accounts/account';

  accounts: IAccount[];

  private accountsSub: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.accountsSub = this.accounts$
      .subscribe(accounts => this.accounts = accounts);
  }

  ngOnDestroy(): void {
    this.accountsSub.unsubscribe();
  }

  get accounts$(): Observable<IAccount[]> {
    return this.accountService.accounts$;
  }

  onAdd(): void {
    this.router.navigateByUrl(AccountsComponent.PATH_ACCOUNT);
  }

  onSelect(networkAccount: INetworkAccount): void {
    this.accountService.setAccounts(this.accounts.map(account => ({
      ...account,
      accounts: account.accounts.map(networkAcc => ({
        ...networkAcc,
        selected: networkAcc === networkAccount
          ? !networkAccount.selected
          : networkAcc.selected
      }))
    })));
  }

  onRemoveAccount(networkAccount: INetworkAccount): void {
    this.accountService.setAccounts(this.accounts.map(account => ({
      ...account,
      accounts: account.accounts.filter(networkAcc => networkAcc !== networkAccount)
    })));
  }

  onRemoveGroup(account: IAccount): void {
    this.accountService.setAccounts(this.accounts.filter(a => a !== account));
  }
}
