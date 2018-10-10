import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { map, first, filter } from 'rxjs/internal/operators';
import { from } from 'rxjs/internal/observable/from';

import { IAppState } from '../state/state.interface';
import { IAccount } from './account.interface';
import { IPlugin } from '../plugin/plugin.interface';
import { INetworkAccount, INetwork } from '../network/network.interface';

import { AbstractEntityService } from '../state/state.service';

import { PluginUtils } from '../plugin/plugin.utils';

@Injectable()
export class AccountService extends AbstractEntityService {

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

  get selectedAccount$(): Observable<IAccount> {
    return this.plugin$
      .pipe(
        map(plugin =>
          plugin.keychain.accounts.find(a => !!a.accounts.find(aa => aa.selected))
        )
      );
  }

  get selectedNetworkAccount$(): Observable<INetworkAccount> {
    return this.selectedAccount$
      .pipe(
        map(a => a.accounts.find(na => na.selected))
      );
  }

  save(account: IAccount): void {
    this.accounts$
      .pipe(
        first()
      )
      .subscribe(accounts =>
        this.set([
          ...accounts,
          {
            ...account,
            id: this.createId(accounts)
          }
        ])
      );
  }

  update(id: string, account: IAccount): void {
    this.accounts$
      .pipe(
        first()
      )
      .subscribe(accounts =>
        this.set(accounts.map(a => a.id === account.id ? account : a))
      );
  }

  delete(id: string): void {
    this.accounts$
      .pipe(
        first()
      )
      .subscribe(accounts =>
        this.set(accounts.filter(a => a.id !== id))
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
              : false
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
