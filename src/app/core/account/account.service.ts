import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';

import { IAppState } from '../state/state.interface';
import { IAccount } from './account.interface';
import { IPlugin } from '../plugin/plugin.interface';

import { AbstractActionService } from '../state/actions.service';

import { PluginUtils } from '../plugin/plugin.utils';
import { INetworkAccount, INetwork } from '../network/network.interface';

import { AccountUtils } from './account.utils';

@Injectable()
export class AccountService extends AbstractActionService {

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
  ) {
    super();
  }

  get accounts$(): Observable<IAccount[]> {
    return this.plugin$
      .pipe(
        map(plugin => plugin.keychain.accounts)
      );
  }

  save(account: IAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts => this.set([ ...accounts, account ]));
  }

  delete(account: IAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts =>
        this.set(accounts.filter(a => a !== account))
      );
  }

  selectAccount(networkAccount: INetworkAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts =>
        this.set(accounts.map(account => ({
          ...account,
          accounts: account.accounts.map(networkAcc => ({
            ...networkAcc,
            selected: networkAcc === networkAccount
              ? !networkAccount.selected
              : networkAcc.selected
          }))
        })))
      );
  }

  deleteAccount(networkAccount: INetworkAccount): void {
    this.accounts$
      .pipe(first())
      .subscribe(accounts =>
        this.set(accounts.map(account => ({
          ...account,
          accounts: account.accounts.filter(networkAcc => networkAcc !== networkAccount)
        })))
      );
  }

  getKeyAccounts(network: INetwork, publicKey: string): Observable<INetworkAccount[]> {
    return from(AccountUtils.getKeyAccounts(network.protocol, network.host, network.port, publicKey))
      .pipe(
        map(({ account_names }) => account_names.map(account => ({ name: account })))
      );
  }

  private set(accounts: IAccount[]): void {
    this.plugin$
      .pipe(first())
      .subscribe((plugin: IPlugin) =>
        this.dispatchAction(PluginUtils.PLUGIN_STORE, {
          ...plugin,
          keychain: {
            ...plugin.keychain,
            accounts
          }
        })
      );
  }
}
